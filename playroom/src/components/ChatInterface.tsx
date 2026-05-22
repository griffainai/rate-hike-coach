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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 h-[calc(100vh-140px)]">
      {/* Main chat column */}
      <div className="panel flex flex-col overflow-hidden">
        <div className="px-5 py-3 border-b-3 border-wine bg-cream-sand flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-wine font-mono font-bold">
              DRILLING.
            </div>
            <div className="text-sm font-mono font-medium text-wine-deep">
              The Rate Hike Conversation
            </div>
          </div>
          <button
            onClick={resetSession}
            className="text-xs uppercase tracking-wider text-wine-muted hover:text-wine transition-colors px-3 py-1 border-2 border-wine-muted hover:border-wine rounded font-mono font-medium"
          >
            End session
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-cream">
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
            <div className="card p-3 text-sm text-accent-warn font-mono" style={{ borderLeftWidth: '6px', borderLeftColor: '#A14A38' }}>
              {error}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t-3 border-wine bg-cream-sand p-3">
          <div className="flex gap-2 items-stretch">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={
                messages.length === 0
                  ? "Tell the coach about the client. Concrete. One example."
                  : "Type. Enter sends. Shift+Enter for newline."
              }
              rows={2}
              disabled={isStreaming}
              className="flex-1 bg-cream border-3 border-wine-deep rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-wine focus:ring-offset-2 focus:ring-offset-cream-sand disabled:opacity-50 font-mono text-wine-deep placeholder:text-wine-soft"
            />
            <button
              onClick={sendMessage}
              disabled={isStreaming || !input.trim()}
              className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed self-stretch"
            >
              {stage === "drill" ? "Drill." : "Send."}
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
        className={`max-w-[85%] rounded-lg px-4 py-3 border-3 ${
          isCoach
            ? "bg-cream-warm border-wine text-wine-deep"
            : "bg-cream-sand border-wine-deep text-wine-deep"
        }`}
        style={
          isCoach
            ? { boxShadow: '3px 3px 0px 0px #5D3136' }
            : { boxShadow: '3px 3px 0px 0px #4A2C2A' }
        }
      >
        <div className="text-xs uppercase tracking-[0.18em] mb-1 font-mono font-bold text-wine">
          {isCoach ? "Coach" : "You"}
        </div>
        <div className="text-sm whitespace-pre-wrap leading-relaxed font-sans">
          {content}
          {streaming && content.length === 0 && (
            <span className="inline-flex gap-1 text-wine">
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
      <div className="text-6xl mb-4">🥊</div>
      <div className="display-tagline text-4xl md:text-5xl mb-2">
        Drill. Name. Hold.
      </div>
      <div className="text-xs uppercase tracking-[0.25em] text-wine-muted mb-6 font-mono font-medium">
        THE REHEARSAL ROOM.
      </div>
      <div className="text-base text-wine-deep max-w-md leading-relaxed space-y-2 font-sans">
        <p>Tell the coach about the client.</p>
        <p>Two years. Same rate. You're about to ask for more.</p>
        <p>Start with that.</p>
      </div>
      <div className="text-xs text-wine-muted mt-8 max-w-md font-mono font-bold tracking-wider uppercase border-3 border-wine-muted rounded px-4 py-2 inline-block">
        No numbers. No scripts. No emails.
      </div>
    </div>
  );
}

function CommitPanel({ stage }: { stage: Stage }) {
  if (stage !== "commit") return null;
  return (
    <div className="panel p-4" style={{ borderColor: '#5A7A4E', boxShadow: '4px 4px 0px 0px #5A7A4E' }}>
      <div className="text-xs uppercase tracking-[0.2em] mb-2 font-mono font-bold" style={{ color: '#5A7A4E' }}>
        COMMIT.
      </div>
      <div className="text-xs text-wine-deep leading-snug space-y-1 font-mono">
        <div>• Walk-away number: $___</div>
        <div>• First-line: "___"</div>
        <div>• Call date: ___</div>
        <div>• Cope to watch: ___</div>
      </div>
      <div className="text-xs text-wine-muted mt-2 font-mono">
        Log this in <code className="bg-cream-sand px-1 rounded">sessions/</code> when done.
      </div>
    </div>
  );
}
