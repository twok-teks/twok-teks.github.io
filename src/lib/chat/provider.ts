import { SYSTEM_POLICY } from "./policy";
import type { ChatMessage, SourceDocument } from "./types";

export const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
export const DEFAULT_GROQ_MODEL = "groq/compound-mini";

export function isConfiguredApiKey(key: string | undefined): key is string {
  return Boolean(
    key &&
    key.trim().length >= 20 &&
    !/(?:placeholder|your[_ -]|replace[_ -]?me|example|changeme|[<>\s])/i.test(
      key,
    ),
  );
}

export function createProviderPayload(
  model: string,
  messages: ChatMessage[],
  documents: SourceDocument[],
) {
  return {
    model,
    messages: [
      { role: "system", content: SYSTEM_POLICY },
      {
        role: "user",
        content: JSON.stringify({
          referenceDocuments: documents.map(({ id, label, content }) => ({
            id,
            label,
            content,
          })),
          conversation: messages,
        }),
      },
    ],
    response_format: { type: "json_object" },
    tool_choice: "none",
    max_completion_tokens: 1_200,
    temperature: 0.2,
  };
}

export function extractProviderText(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const choices = (value as Record<string, unknown>).choices;
  if (!Array.isArray(choices) || !choices[0] || typeof choices[0] !== "object")
    return null;
  const choice = choices[0] as Record<string, unknown>;
  if (choice.finish_reason !== "stop") return null;
  const message = choice.message;
  if (!message || typeof message !== "object") return null;
  const record = message as Record<string, unknown>;
  if (
    (record.tool_calls !== undefined &&
      (!Array.isArray(record.tool_calls) || record.tool_calls.length > 0)) ||
    (record.executed_tools !== undefined &&
      (!Array.isArray(record.executed_tools) ||
        record.executed_tools.length > 0)) ||
    record.function_call ||
    typeof record.content !== "string"
  )
    return null;
  return record.content;
}
