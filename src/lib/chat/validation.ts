import {
  MAX_ASSISTANT_CHARACTERS,
  MAX_HISTORY_CHARACTERS,
  MAX_HISTORY_MESSAGES,
  MAX_REQUEST_BYTES,
  MAX_USER_CHARACTERS,
  SESSION_LIMIT_MESSAGE,
  type ChatMessage,
} from "./types";

export class ChatInputError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function readBoundedJson(
  body: ReadableStream<Uint8Array> | null,
  limit = MAX_REQUEST_BYTES,
): Promise<unknown> {
  if (!body) throw new ChatInputError(400, "Send a conversation as JSON.");
  const reader = body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let text = "";
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > limit) {
        await reader.cancel();
        throw new ChatInputError(413, SESSION_LIMIT_MESSAGE);
      }
      text += decoder.decode(chunk.value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof ChatInputError) throw error;
    throw new ChatInputError(400, "Send a valid JSON conversation.");
  } finally {
    reader.releaseLock();
  }
}

export function validateConversation(value: unknown): ChatMessage[] {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).length !== 1 ||
    !Object.hasOwn(value, "messages")
  )
    throw new ChatInputError(400, "Send a conversation in the messages field.");

  const messages = (value as { messages: unknown }).messages;
  if (!Array.isArray(messages) || !messages.length) {
    throw new ChatInputError(400, "Ask a question to start the conversation.");
  }
  if (messages.length > MAX_HISTORY_MESSAGES) {
    throw new ChatInputError(413, SESSION_LIMIT_MESSAGE);
  }

  let total = 0;
  const validated: ChatMessage[] = [];
  for (const message of messages) {
    if (
      !message ||
      typeof message !== "object" ||
      Array.isArray(message) ||
      Object.keys(message).sort().join(",") !== "content,role" ||
      !["user", "assistant"].includes(message.role) ||
      typeof message.content !== "string" ||
      !message.content.trim()
    )
      throw new ChatInputError(
        400,
        "Conversation messages must contain a user or assistant role and nonempty text.",
      );

    const limit =
      message.role === "user" ? MAX_USER_CHARACTERS : MAX_ASSISTANT_CHARACTERS;
    if (message.content.length > limit) {
      throw new ChatInputError(
        413,
        message.role === "user"
          ? "Keep each question to 1,200 characters or fewer."
          : SESSION_LIMIT_MESSAGE,
      );
    }
    if (message.role === "assistant" && validated.at(-1)?.role !== "user") {
      throw new ChatInputError(
        400,
        "Each assistant reply must follow a user question.",
      );
    }
    total += message.content.length;
    validated.push({ role: message.role, content: message.content });
  }
  if (validated[0].role !== "user" || validated.at(-1)?.role !== "user") {
    throw new ChatInputError(
      400,
      "A conversation must begin and end with a user question.",
    );
  }
  if (total > MAX_HISTORY_CHARACTERS)
    throw new ChatInputError(413, SESSION_LIMIT_MESSAGE);
  // Preserve the entire transcript byte-for-byte; the UI owns reset and retention.
  return validated;
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin || request.headers.get("sec-fetch-site") === "cross-site")
    return false;

  try {
    const requestUrl = new URL(request.url);
    if (!["http:", "https:"].includes(requestUrl.protocol)) return false;
    const browserOrigin = new URL(origin);
    if (origin !== browserOrigin.origin) return false;

    const host = request.headers.get("host");
    let expectedOrigin = requestUrl.origin;
    if (host !== null) {
      // Next may canonicalize request.url to localhost while retaining the real
      // authority in Host. Never substitute arbitrary X-Forwarded-Host values.
      const domainAuthority =
        /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*(?::[0-9]{1,5})?$/i;
      const ipv6Authority = /^\[[0-9a-f:.]+\](?::[0-9]{1,5})?$/i;
      if (
        host.length > 260 ||
        (!domainAuthority.test(host) && !ipv6Authority.test(host))
      )
        return false;
      const authorityUrl = new URL(requestUrl.protocol + "//" + host);
      expectedOrigin = authorityUrl.origin;
    }
    return browserOrigin.origin === expectedOrigin;
  } catch {
    return false;
  }
}
