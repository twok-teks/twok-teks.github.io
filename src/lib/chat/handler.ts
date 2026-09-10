import { isClearlyOutsideScope, parseGroundedReply } from "./policy";
import {
  createProviderPayload,
  DEFAULT_GROQ_MODEL,
  extractProviderText,
  GROQ_ENDPOINT,
  isConfiguredApiKey,
} from "./provider";
import { createRateLimiter } from "./rate-limit";
import {
  ChatInputError,
  isSameOrigin,
  readBoundedJson,
  validateConversation,
} from "./validation";
import {
  MAX_REQUEST_BYTES,
  MAX_SOURCE_CHARACTERS,
  OFFLINE_MESSAGE,
  SCOPE_REPLY,
  SESSION_LIMIT_MESSAGE,
  type ChatMessage,
  type SourceDocument,
} from "./types";

type ChatHandlerOptions = {
  getConfiguration: () => { apiKey?: string; model?: string };
  getSources: (
    signal: AbortSignal,
    messages: ChatMessage[],
  ) => Promise<SourceDocument[]>;
  fetchImpl?: typeof fetch;
  allowRequest?: (request: Request) => boolean;
  timeoutMs?: number;
};

function json(body: unknown, status = 200, headers?: Record<string, string>) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

/** Dependencies are injected for provider-free tests; configuration and keys never enter responses. */
export function createChatHandler(options: ChatHandlerOptions) {
  const fetchImpl = options.fetchImpl || fetch;
  const allowRequest = options.allowRequest || createRateLimiter();
  return async (request: Request): Promise<Response> => {
    if (!isSameOrigin(request))
      return json(
        { error: "Open the assistant from this portfolio to send a question." },
        403,
      );
    if (
      request.headers
        .get("content-type")
        ?.split(";")[0]
        .trim()
        .toLowerCase() !== "application/json"
    ) {
      return json({ error: "Send the conversation as application/json." }, 415);
    }
    const length = request.headers.get("content-length");
    if (
      length &&
      (!/^\d+$/.test(length) || Number(length) > MAX_REQUEST_BYTES)
    ) {
      return json({ error: SESSION_LIMIT_MESSAGE }, 413);
    }
    if (!allowRequest(request)) {
      return json(
        {
          error:
            "A few too many questions arrived at once. Try again in a minute.",
        },
        429,
        { "Retry-After": "60" },
      );
    }

    let messages;
    try {
      messages = validateConversation(await readBoundedJson(request.body));
    } catch (error) {
      if (error instanceof ChatInputError)
        return json({ error: error.message }, error.status);
      return json(
        { error: "The conversation could not be read. Try again." },
        400,
      );
    }

    if (isClearlyOutsideScope(messages.at(-1)!.content))
      return json({ reply: SCOPE_REPLY });

    const configuration = options.getConfiguration();
    const apiKey = configuration.apiKey?.trim();
    if (!isConfiguredApiKey(apiKey))
      return json({ error: OFFLINE_MESSAGE }, 503);

    const controller = new AbortController();
    const abort = () => controller.abort();
    request.signal.addEventListener("abort", abort, { once: true });
    if (request.signal.aborted) abort();
    const timer = setTimeout(abort, options.timeoutMs ?? 25_000);

    try {
      const documents = await options.getSources(controller.signal, messages);
      if (
        !documents.length ||
        documents.reduce(
          (length, document) => length + document.content.length,
          0,
        ) > MAX_SOURCE_CHARACTERS
      )
        return json(
          {
            error:
              "The portfolio sources are unavailable. Please try again shortly.",
          },
          503,
        );
      const response = await fetchImpl(GROQ_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          createProviderPayload(
            configuration.model?.trim() || DEFAULT_GROQ_MODEL,
            messages,
            documents,
          ),
        ),
        cache: "no-store",
        redirect: "error",
        signal: controller.signal,
      });
      if (!response.ok) {
        let providerErrorType = "unknown";
        let providerErrorCode = "unknown";
        let providerErrorMessage = "No provider message";
        try {
          const details = await readBoundedJson(response.body, 16_000);
          if (
            details &&
            typeof details === "object" &&
            !Array.isArray(details)
          ) {
            const nested = (details as Record<string, unknown>).error;
            if (
              nested &&
              typeof nested === "object" &&
              !Array.isArray(nested)
            ) {
              const error = nested as Record<string, unknown>;
              if (typeof error.type === "string")
                providerErrorType = error.type;
              if (typeof error.code === "string")
                providerErrorCode = error.code;
              if (typeof error.message === "string") {
                providerErrorMessage = error.message
                  .replace(/gsk_[a-z0-9_-]+/gi, "[redacted]")
                  .replace(/[\r\n]+/g, " ")
                  .slice(0, 300);
              }
            }
          }
        } catch {
          providerErrorMessage = "Unreadable provider error";
        }
        console.error("Groq chat request failed", {
          status: response.status,
          type: providerErrorType,
          code: providerErrorCode,
          message: providerErrorMessage,
        });
        if (response.status === 429)
          return json(
            { error: "The assistant is busy. Please try again in a moment." },
            429,
          );
        if (response.status === 401 || response.status === 403)
          return json(
            {
              error:
                "The assistant’s connection needs attention. Please explore the portfolio while it’s being restored.",
            },
            503,
          );
        return json(
          {
            error:
              "The assistant could not answer right now. Please try again.",
          },
          502,
        );
      }
      const raw = extractProviderText(
        await readBoundedJson(response.body, 64_000),
      );
      const result = raw ? parseGroundedReply(raw, documents) : null;
      if (!result)
        return json(
          {
            error:
              "I couldn’t verify that answer against the portfolio sources. Please rephrase the question or try again.",
          },
          502,
        );
      return json(result);
    } catch {
      if (controller.signal.aborted)
        return json(
          {
            error: "The assistant took too long to respond. Please try again.",
          },
          504,
        );
      return json(
        { error: "The assistant could not connect. Please try again shortly." },
        502,
      );
    } finally {
      clearTimeout(timer);
      request.signal.removeEventListener("abort", abort);
    }
  };
}
