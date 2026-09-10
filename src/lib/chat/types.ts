export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatSource = { label: string; url: string };
export type ChatReply = { reply: string; sources?: ChatSource[] };
export type SourceDocument = ChatSource & { id: string; content: string };

export const MAX_USER_CHARACTERS = 1_200;
export const MAX_ASSISTANT_CHARACTERS = 6_000;
export const MAX_HISTORY_CHARACTERS = 12_000;
export const MAX_SOURCE_CHARACTERS = 48_000;
export const MAX_HISTORY_MESSAGES = 200;
export const MAX_REQUEST_BYTES = 100_000;
export const SESSION_LIMIT_MESSAGE =
  "This conversation has reached its size limit. Start a new session to continue; your earlier messages have not been discarded.";
export const SCOPE_REPLY =
  "I can help with Khanh’s background, experience, research, projects, and public GitHub work. Ask me about one of those, and I’ll answer from the available sources.";
export const OFFLINE_MESSAGE =
  "The AI assistant isn’t connected yet. You can still explore Khanh’s projects, experience, and résumé on the site.";
