"use client";

import Link from "next/link";
import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import "./clone-chat.css";

type Source = { label: string; url: string };
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};
type Session = {
  version: 1;
  id: string;
  open: boolean;
  draft: string;
  messages: Message[];
  pending: boolean;
  error: string | null;
  scrollTop: number;
};

const storageKey = "khanh-clone-session-v1";
const emptySession: Session = {
  version: 1,
  id: "",
  open: false,
  draft: "",
  messages: [],
  pending: false,
  error: null,
  scrollTop: 0,
};
let currentSession: Session | undefined;
const listeners = new Set<() => void>();

function identifier() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function safeHref(value: string): string | null {
  if (/[\u0000-\u0020\\]/.test(value)) return null;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function validSources(value: unknown): Source[] {
  if (!Array.isArray(value)) return [];
  const sources = value.filter(
    (source): source is Source =>
      Boolean(source) &&
      typeof source.label === "string" &&
      typeof source.url === "string" &&
      Boolean(safeHref(source.url)),
  );
  return [...new Map(sources.map((source) => [source.url, source])).values()];
}

function getSession(): Session {
  if (currentSession) return currentSession;
  const fresh = { ...emptySession, id: identifier(), messages: [] };
  try {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      const value = JSON.parse(saved);
      if (
        value.version === 1 &&
        typeof value.id === "string" &&
        typeof value.open === "boolean" &&
        typeof value.draft === "string" &&
        Array.isArray(value.messages) &&
        value.messages.every(
          (message: Message) =>
            message &&
            typeof message.id === "string" &&
            (message.role === "user" || message.role === "assistant") &&
            typeof message.content === "string",
        )
      ) {
        currentSession = {
          version: 1,
          id: value.id,
          open: value.open,
          draft: value.draft,
          messages: value.messages.map((message: Message) => ({
            ...message,
            sources: validSources(message.sources),
          })),
          pending: false,
          error: value.pending
            ? "Your reply was interrupted. Retry to continue this conversation."
            : typeof value.error === "string"
              ? value.error
              : null,
          scrollTop:
            typeof value.scrollTop === "number" &&
            Number.isFinite(value.scrollTop)
              ? Math.max(0, value.scrollTop)
              : 0,
        };
      }
    }
  } catch {
    // The chat also works in memory when browser storage is unavailable.
  }
  currentSession ??= fresh;
  return currentSession;
}

function updateSession(patch: Partial<Session>, notify = true) {
  currentSession = { ...getSession(), ...patch };
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(currentSession));
  } catch {
    // Keep the conversation usable even if browser storage is blocked or full.
  }
  if (notify) listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function ChatIcon({
  name,
  size = 20,
}: {
  name: "robot" | "send" | "refresh" | "close" | "down";
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "robot" && (
        <>
          <rect x="4" y="7" width="16" height="13" rx="4" />
          <path d="M12 7V3m-1 0h2M1 12v4m22-4v4M9 16h6" />
          <circle cx="8.5" cy="12" r=".7" fill="currentColor" />
          <circle cx="15.5" cy="12" r=".7" fill="currentColor" />
        </>
      )}
      {name === "send" && (
        <>
          <path d="m4 4 17 8-17 8 3-8-3-8Z" />
          <path d="M7 12h14" />
        </>
      )}
      {name === "refresh" && (
        <>
          <path d="M20 7v5h-5M4 17v-5h5" />
          <path d="M6.1 6.1A8 8 0 0 1 20 12M4 12a8 8 0 0 0 13.9 5.9" />
        </>
      )}
      {name === "close" && <path d="m6 6 12 12M6 18 18 6" />}
      {name === "down" && <path d="m6 9 6 6 6-6" />}
    </svg>
  );
}

function SafeLink({ href, children }: { href: string; children: string }) {
  const safe = safeHref(href);
  if (!safe) return <>{children}</>;
  return safe.startsWith("/") ? (
    <Link href={safe}>{children}</Link>
  ) : (
    <a href={safe} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function InlineText({ text }: { text: string }) {
  const matches = [
    ...text.matchAll(
      /\[([^\]\n]{1,120})\]\(([^)\s]+)\)|\*\*([^*\n]{1,160})\*\*/g,
    ),
  ];
  let position = 0;
  return (
    <>
      {matches.map((match) => {
        const start = match.index ?? 0;
        const preceding = text.slice(position, start);
        position = start + match[0].length;
        return (
          <Fragment key={start}>
            {preceding}
            {match[3] ? (
              <strong>{match[3]}</strong>
            ) : (
              <SafeLink href={match[2]}>{match[1]}</SafeLink>
            )}
          </Fragment>
        );
      })}
      {text.slice(position)}
    </>
  );
}

function MessageText({ content }: { content: string }) {
  const blocks = content.trim().split(/\n\s*\n/);

  return (
    <div className="clone-chat-rich-text">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").filter((line) => line.trim());
        const unordered = lines.every((line) => /^[-*]\s+/.test(line));
        const labeled =
          lines.length > 1 &&
          lines.every((line) => /^\*\*[^*\n]{1,80}:\*\*\s+/.test(line));
        const ordered = lines.every((line) => /^\d+[.)]\s+/.test(line));

        if (unordered || labeled) {
          return (
            <ul key={blockIndex}>
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>
                  <InlineText text={line.replace(/^[-*]\s+/, "")} />
                </li>
              ))}
            </ul>
          );
        }

        if (ordered) {
          return (
            <ol key={blockIndex}>
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>
                  <InlineText text={line.replace(/^\d+[.)]\s+/, "")} />
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={blockIndex}>
            {lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 && <br />}
                <InlineText text={line} />
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

const suggestions = [
  "What does Khanh build?",
  "Tell me about GitGuide",
  "What is his AI experience?",
];

export function CloneChat() {
  const session = useSyncExternalStore(
    subscribe,
    getSession,
    () => emptySession,
  );
  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const request = useRef<AbortController | null>(null);
  const focusOnOpen = useRef(false);
  const wasOpen = useRef(false);
  const hasShown = useRef(false);
  const followLatest = useRef(true);
  const [announcements, setAnnouncements] = useState<Message[]>([]);
  const [hasNewReply, setHasNewReply] = useState(false);

  useLayoutEffect(() => {
    const log = transcript.current;
    if (!session.open || !log) {
      wasOpen.current = false;
      return;
    }
    if (!wasOpen.current) {
      log.scrollTop = session.scrollTop;
      if (!hasShown.current) {
        followLatest.current =
          log.scrollHeight - log.scrollTop - log.clientHeight < 48;
        hasShown.current = true;
      }
      wasOpen.current = true;
    }
    if (followLatest.current) log.scrollTop = log.scrollHeight;
    if (focusOnOpen.current) {
      input.current?.focus({ preventScroll: true });
      focusOnOpen.current = false;
    }
  }, [
    session.open,
    session.messages.length,
    session.pending,
    session.scrollTop,
  ]);

  useEffect(() => () => request.current?.abort(), []);

  function openChat() {
    focusOnOpen.current = true;
    updateSession({ open: true });
  }

  function closeChat() {
    updateSession({
      open: false,
      scrollTop: transcript.current?.scrollTop ?? session.scrollTop,
    });
    launcher.current?.focus({ preventScroll: true });
  }

  function newSession() {
    request.current?.abort();
    request.current = null;
    followLatest.current = true;
    setAnnouncements([]);
    setHasNewReply(false);
    updateSession({
      ...emptySession,
      id: identifier(),
      messages: [],
      open: true,
    });
    input.current?.focus({ preventScroll: true });
  }

  async function sendQuestion(question: string, retry = false) {
    const before = getSession();
    const content = question.trim();
    if (before.pending || !content || content.length > 1200) return;
    const last = before.messages.at(-1);
    const reuseLast =
      last?.role === "user" &&
      (retry || (Boolean(before.error) && last.content === content));
    const messages: Message[] = reuseLast
      ? before.messages
      : [...before.messages, { id: identifier(), role: "user", content }];
    const controller = new AbortController();
    request.current = controller;
    const sessionId = before.id;
    followLatest.current = true;
    setHasNewReply(false);
    updateSession({
      messages,
      draft: retry ? before.draft : "",
      pending: true,
      error: null,
    });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          typeof result?.error === "string"
            ? result.error
            : "The chat is unavailable right now. Please try again in a moment.",
        );
      }
      if (typeof result?.reply !== "string" || !result.reply.trim()) {
        throw new Error("The reply could not be loaded. Please try again.");
      }
      if (controller.signal.aborted || getSession().id !== sessionId) return;
      const reply: Message = {
        id: identifier(),
        role: "assistant",
        content: result.reply,
        sources: validSources(result.sources),
      };
      updateSession({
        messages: [...messages, reply],
        pending: false,
        error: null,
        draft: getSession().draft === content ? "" : getSession().draft,
      });
      setAnnouncements((existing) => [...existing, reply]);
      if (!followLatest.current) setHasNewReply(true);
    } catch (error) {
      if (controller.signal.aborted || getSession().id !== sessionId) return;
      updateSession({
        pending: false,
        error:
          error instanceof Error && !(error instanceof TypeError)
            ? error.message
            : "The connection was interrupted. Retry when you’re ready.",
      });
    } finally {
      if (request.current === controller) request.current = null;
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendQuestion(getSession().draft);
  }

  function scrollToLatest() {
    const log = transcript.current;
    if (!log) return;
    followLatest.current = true;
    log.scrollTop = log.scrollHeight;
    updateSession({ scrollTop: log.scrollTop }, false);
    setHasNewReply(false);
  }

  return (
    <div className="clone-chat">
      <section
        className="clone-chat-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="clone-chat-title"
        aria-describedby="clone-chat-subtitle"
        id="clone-chat-panel"
        hidden={!session.open}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            closeChat();
          }
        }}
      >
        <header className="clone-chat-header">
          <span className="clone-chat-avatar">
            <ChatIcon name="robot" size={23} />
          </span>
          <div className="clone-chat-heading">
            <h2 id="clone-chat-title">Khanh’s Clone</h2>
            <p id="clone-chat-subtitle">AI guide to my work</p>
          </div>
          <div className="clone-chat-tools">
            <button
              type="button"
              className="clone-chat-icon-button"
              onClick={newSession}
              aria-label="New session"
              title="New session — clear this conversation"
            >
              <ChatIcon name="refresh" size={18} />
            </button>
            <button
              type="button"
              className="clone-chat-icon-button"
              onClick={closeChat}
              aria-label="Close Khanh’s Clone"
              title="Minimize chat"
            >
              <ChatIcon name="close" size={18} />
            </button>
          </div>
        </header>
        <div
          className="clone-chat-transcript"
          tabIndex={0}
          role="region"
          aria-label="Chat conversation"
          ref={transcript}
          onScroll={() => {
            const log = transcript.current;
            if (!log || !getSession().open) return;
            followLatest.current =
              log.scrollHeight - log.scrollTop - log.clientHeight < 48;
            updateSession({ scrollTop: log.scrollTop }, false);
            if (followLatest.current && hasNewReply) setHasNewReply(false);
          }}
        >
          <div className="clone-chat-intro">
            <span className="clone-chat-kicker">
              A little context, on demand
            </span>
            <h3>Get to know the work.</h3>
            <p>
              Ask about Khanh’s projects, résumé, and GitHub work. I’ll stick to
              that material and say when something isn’t covered.
            </p>
          </div>
          {session.messages.length === 0 && (
            <div
              className="clone-chat-suggestions"
              aria-label="Suggested questions"
            >
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void sendQuestion(suggestion)}
                  disabled={session.pending}
                >
                  {suggestion}
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          )}
          <ol className="clone-chat-messages" aria-label="Conversation">
            {session.messages.map((message) => (
              <li
                key={message.id}
                className={`clone-chat-message clone-chat-message-${message.role}`}
              >
                <span className="clone-chat-speaker">
                  {message.role === "user" ? "You" : "Khanh’s Clone"}
                </span>
                <div className="clone-chat-message-content">
                  <MessageText content={message.content} />
                </div>
                {Boolean(message.sources?.length) && (
                  <div className="clone-chat-sources">
                    <span>Explore the sources</span>
                    <ul>
                      {message.sources?.map((source) => (
                        <li key={source.url}>
                          <SafeLink href={source.url}>{source.label}</SafeLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ol>
          {session.pending && (
            <p className="clone-chat-pending" role="status">
              <span aria-hidden="true" />
              Looking through Khanh’s work…
            </p>
          )}
          {session.error && (
            <div className="clone-chat-error">
              <p role="alert">{session.error}</p>
              {session.messages.at(-1)?.role === "user" && (
                <button
                  type="button"
                  onClick={() =>
                    void sendQuestion(
                      getSession().messages.at(-1)!.content,
                      true,
                    )
                  }
                >
                  Retry reply
                </button>
              )}
            </div>
          )}
        </div>
        {hasNewReply && (
          <button
            className="clone-chat-new-reply"
            type="button"
            onClick={scrollToLatest}
          >
            New reply <ChatIcon name="down" size={14} />
          </button>
        )}
        <form className="clone-chat-form" onSubmit={submit}>
          <label className="sr-only" htmlFor="clone-chat-input">
            Your question for Khanh’s Clone
          </label>
          <div className="clone-chat-compose">
            <textarea
              id="clone-chat-input"
              ref={input}
              value={session.draft}
              onChange={(event) => updateSession({ draft: event.target.value })}
              placeholder="Ask about my work…"
              rows={2}
              maxLength={1200}
              readOnly={session.pending}
              aria-describedby="clone-chat-input-help"
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  void sendQuestion(getSession().draft);
                }
              }}
            />
            <button
              type="submit"
              className="clone-chat-send"
              disabled={session.pending || !session.draft.trim()}
              aria-label="Send message"
            >
              <ChatIcon name="send" size={18} />
            </button>
          </div>
          <div className="clone-chat-form-footer">
            <p id="clone-chat-input-help">AI answers · Check the sources</p>
            <span aria-label={`${session.draft.length} of 1200 characters`}>
              {session.draft.length > 1000
                ? `${session.draft.length}/1200`
                : "Enter to send"}
            </span>
          </div>
        </form>
      </section>
      <button
        ref={launcher}
        type="button"
        className="clone-chat-launcher"
        aria-label={
          session.open ? "Minimize Khanh’s Clone" : "Open Khanh’s Clone"
        }
        aria-expanded={session.open}
        aria-controls="clone-chat-panel"
        onClick={session.open ? closeChat : openChat}
      >
        <ChatIcon name={session.open ? "down" : "robot"} size={25} />
        <span className="clone-chat-launcher-label" aria-hidden="true">
          Khanh’s Clone
        </span>
      </button>
      <div
        className="sr-only"
        role="log"
        aria-label="New replies from Khanh’s Clone"
        aria-live="polite"
        aria-relevant="additions"
      >
        {announcements.map((message) => (
          <p key={message.id}>{message.content}</p>
        ))}
      </div>
    </div>
  );
}
