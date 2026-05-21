"use client";

import { useEffect, useRef, useState } from "react";
import { detectCope, DetectedPattern } from "@/lib/cope-detector";
import { CopePanel } from "./CopePanel";
import { StageIndicator, inferStage, Stage } from "./StageIndicator";
import { SessionTimer } from "./SessionTimer";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [detected, setDetected] = useState<DetectedPattern[]>([]);
  const [stage, setStage] = useState<Stage>("intake");
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setStage(inferStage(messages));
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isStreaming) return;

    setError(null);

    // Detect cope patterns from the user's input
    const newPatterns = detectCope(text);
    if (newPatterns.length > 0) {
      setDetected((prev) => {
        const existing = new Set(prev.map((p) => p.id));
        const merged = [...prev];
        for (const p of newPatterns) {
          if (!existing.has(p.id)) merged.push(p);
        }
        return merged;
      });
    }

    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages([...updated, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });

      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => ({ error: "Unknown error" }));
        setError(errBody.error || "Coach API failed");
        setMessages(updated);
        setIsStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages([
          ...updated,
          { role: "assistant", content: assistantText },
        ]);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function resetSession() {
    if (
      messages.length > 0 &&
      !confirm("End this session? Conversation will be cleared.")
    ) {
      return;
    }
    setMessages([]);
    setDetected([]);
    setStage("intake");
    setError(null);
  }

  const sessionStarted = messages.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 h-[calc(100vh-120px)]">
      {/* Main chat column */}
      <div className="panel flex flex-col overflow-hidden">
        <div className="px-5 py-3 border-b border-bg-border flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-accent-coach/50">
              Drilling
            </div>
            <div className="text-sm font-medium">
              Rate Hike Conversation
            </div>
          </div>
          <button
            onClick={resetSession}
            className="text-xs text-accent-coach/40 hover:text-accent-coach transition-colors px-3 py-1 border border-bg-border rounded"
          >
            End session
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            messages.map((m, idx) => (
              <MessageBubble
                key={idx}
                role={m.role}
                content={m.content}
                streaming={
                  isStreaming &&
                  idx === messages.length - 1 &&
                  m.role === "assistant"
                }
              />
            ))
          )}
          {error && (
            <div className="card p-3 border-l-2 border-l-accent-warn text-sm text-accent-warn">
              {error}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-bg-border p-3">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={
                messages.length === 0
                  ? "Tell the coach about the client you want to raise rates with…"
                  : "Type your response. Enter to send, Shift+Enter for newline."
              }
              rows={2}
              disabled={isStreaming}
              className="flex-1 bg-bg-card border border-bg-border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:border-accent-user/50 disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={isStreaming || !input.trim()}
              className="px-4 py-2 bg-accent-user text-bg rounded text-sm font-medium hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-4 overflow-y-auto">
        <SessionTimer started={sessionStarted} />
        <StageIndicator current={stage} />
        <CopePanel detected={detected} />
        <CommitPanel stage={stage} />
      </div>
    </div>
  );
}

function MessageBubble({
  role,
  content,
  streaming,
}: {
  role: "user" | "assistant";
  content: string;
  streaming: boolean;
}) {
  const isCoach = role === "assistant";
  return (
    <div className={`flex ${isCoach ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-3 ${
          isCoach
            ? "bg-bg-card border border-bg-border text-accent-coach"
            : "bg-accent-user/10 border border-accent-user/30 text-accent-coach"
        }`}
      >
        <div className="text-xs uppercase tracking-wider mb-1 opacity-50">
          {isCoach ? "Coach" : "You"}
        </div>
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {content}
          {streaming && content.length === 0 && (
            <span className="inline-flex gap-1">
              <span className="typing-dot">·</span>
              <span className="typing-dot">·</span>
              <span className="typing-dot">·</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <div className="text-4xl mb-3">🥊</div>
      <div className="text-lg font-medium text-accent-coach mb-2">
        The Rehearsal Room
      </div>
      <div className="text-sm text-accent-coach/60 max-w-md leading-relaxed">
        Start the session by telling the coach about the client you want to raise rates with.
        How long they've been a client, what you charge now, what their reaction would be.
      </div>
      <div className="text-xs text-accent-coach/40 mt-4 max-w-md">
        The coach will refuse to give you a number, a script, or an email.
        It will drill you on the conversation until you can hold your rate without flinching.
      </div>
    </div>
  );
}

function CommitPanel({ stage }: { stage: Stage }) {
  if (stage !== "commit") return null;
  return (
    <div className="panel p-4 border border-accent-ok/30">
      <div className="text-xs uppercase tracking-wider text-accent-ok mb-2">
        Commit Phase
      </div>
      <div className="text-xs text-accent-coach/70 leading-snug space-y-1">
        <div>• Walk-away number: $___</div>
        <div>• First-line: "___"</div>
        <div>• Call date: ___</div>
        <div>• Cope to watch: ___</div>
      </div>
      <div className="text-xs text-accent-coach/40 mt-2 italic">
        Paste the coach's session-log into <code>sessions/</code> when done.
      </div>
    </div>
  );
}
