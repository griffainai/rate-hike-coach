"use client";

import { useEffect, useRef, useState } from "react";
import { detectCope, DetectedPattern } from "@/lib/cope-detector";
import { Mode, MODES } from "@/lib/modes";
import { CopePanel } from "./CopePanel";
import { StageIndicator, inferStage, Stage } from "./StageIndicator";
import { SessionTimer } from "./SessionTimer";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function ChatInterface({ mode = "pre-game" as Mode }: { mode?: Mode }) {
  const meta = MODES[mode];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [detected, setDetected] = useState<DetectedPattern[]>([]);
  const [stage, setStage] = useState<Stage>(meta.stages[0].id);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setStage(inferStage(messages, mode));
  }, [messages, mode]);

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
        body: JSON.stringify({ messages: updated, mode }),
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
    setStage(meta.stages[0].id);
    setError(null);
  }

  const sessionStarted = messages.length > 0;
  const isTimeout = mode === "timeout";

  const sendButtonText =
    isTimeout
      ? "Send."
      : mode === "post-game"
        ? "Log."
        : stage === "drill" || stage === "redrill"
          ? "Drill."
          : "Send.";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 h-[calc(100vh-180px)]">
      {/* Main chat column */}
      <div
        className="panel flex flex-col overflow-hidden"
        style={{
          borderColor: meta.borderTint,
          boxShadow: `4px 4px 0px 0px ${meta.shadowHex}`,
        }}
      >
        <div
          className="px-5 py-3 border-b-3 flex items-center justify-between"
          style={{
            borderColor: meta.borderTint,
            background: isTimeout ? meta.bgTint : "#EFE3D7",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{meta.emoji}</span>
            <div>
              <div
                className="text-xs uppercase tracking-[0.2em] font-mono font-bold"
                style={{ color: meta.accentHex }}
              >
                {meta.label.toUpperCase()}.
              </div>
              <div className="text-sm font-mono font-medium text-wine-deep">
                {meta.subtitle}
              </div>
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
            <EmptyState mode={mode} />
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
                mode={mode}
              />
            ))
          )}
          {error && (
            <div
              className="card p-3 text-sm font-mono"
              style={{
                borderLeftWidth: "6px",
                borderLeftColor: "#A14A38",
                color: "#A14A38",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Input */}
        <div
          className="border-t-3 p-3"
          style={{
            borderColor: meta.borderTint,
            background: isTimeout ? meta.bgTint : "#EFE3D7",
          }}
        >
          <div className="flex gap-2 items-stretch">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={meta.inputPlaceholder}
              rows={isTimeout ? 1 : 2}
              disabled={isStreaming}
              className="flex-1 bg-cream border-3 border-wine-deep rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 font-mono text-wine-deep placeholder:text-wine-soft"
              style={
                {
                  "--tw-ring-color": meta.accentHex,
                } as React.CSSProperties
              }
            />
            <button
              onClick={sendMessage}
              disabled={isStreaming || !input.trim()}
              className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed self-stretch"
              style={{
                background: meta.accentHex,
                borderColor: meta.shadowHex,
                boxShadow: `3px 3px 0px 0px ${meta.shadowHex}`,
              }}
            >
              {sendButtonText}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-4 overflow-y-auto">
        {!isTimeout && <SessionTimer started={sessionStarted} />}
        {isTimeout && <UrgentTimer started={sessionStarted} />}
        <StageIndicator current={stage} mode={mode} />
        {!isTimeout && <CopePanel detected={detected} />}
        <CommitPanel mode={mode} stage={stage} />
        {isTimeout && <ExitPanel />}
      </div>
    </div>
  );
}

function MessageBubble({
  role,
  content,
  streaming,
  mode,
}: {
  role: "user" | "assistant";
  content: string;
  streaming: boolean;
  mode: Mode;
}) {
  const meta = MODES[mode];
  const isCoach = role === "assistant";
  return (
    <div className={`flex ${isCoach ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-3 border-3`}
        style={
          isCoach
            ? {
                background: meta.bgTint,
                borderColor: meta.borderTint,
                boxShadow: `3px 3px 0px 0px ${meta.shadowHex}`,
                color: "#4A2C2A",
              }
            : {
                background: "#EFE3D7",
                borderColor: "#4A2C2A",
                boxShadow: "3px 3px 0px 0px #4A2C2A",
                color: "#4A2C2A",
              }
        }
      >
        <div
          className="text-xs uppercase tracking-[0.18em] mb-1 font-mono font-bold"
          style={{ color: isCoach ? meta.accentHex : "#5D3136" }}
        >
          {isCoach ? "Coach" : "You"}
        </div>
        <div className="text-sm whitespace-pre-wrap leading-relaxed font-sans">
          {content}
          {streaming && content.length === 0 && (
            <span className="inline-flex gap-1" style={{ color: meta.accentHex }}>
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

function EmptyState({ mode }: { mode: Mode }) {
  const meta = MODES[mode];
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <div className="text-6xl mb-4">{meta.emoji}</div>
      <div className="display-tagline text-4xl md:text-5xl mb-2" style={{ color: meta.accentHex }}>
        {meta.emptyStateTitle}
      </div>
      <div className="text-xs uppercase tracking-[0.25em] text-wine-muted mb-6 font-mono font-medium">
        {meta.subtitle.toUpperCase()}
      </div>
      <div className="text-base text-wine-deep max-w-md leading-relaxed space-y-2 font-sans">
        {meta.emptyStateLines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <div
        className="text-xs text-wine-muted mt-8 max-w-md font-mono font-bold tracking-wider uppercase border-3 rounded px-4 py-2 inline-block"
        style={{ borderColor: meta.borderTint, color: meta.accentHex }}
      >
        {meta.emptyStateFooter}
      </div>
    </div>
  );
}

function CommitPanel({ mode, stage }: { mode: Mode; stage: Stage }) {
  if (mode === "timeout") return null;
  if (mode === "pre-game" && stage !== "commit") return null;
  if (mode === "halftime" && stage !== "commit") return null;
  if (mode === "post-game" && stage !== "log") return null;

  const isPostGame = mode === "post-game";
  const meta = MODES[mode];

  return (
    <div
      className="panel p-4"
      style={{
        borderColor: "#5A7A4E",
        boxShadow: "4px 4px 0px 0px #5A7A4E",
      }}
    >
      <div className="text-xs uppercase tracking-[0.2em] mb-2 font-mono font-bold" style={{ color: "#5A7A4E" }}>
        {isPostGame ? "LOG." : "COMMIT."}
      </div>
      <div className="text-xs text-wine-deep leading-snug space-y-1 font-mono">
        {isPostGame ? (
          <>
            <div>• What I actually said: ___</div>
            <div>• Walk-away held / softened: ___</div>
            <div>• Where I flinched: ___</div>
            <div>• Pattern that showed up: ___</div>
          </>
        ) : (
          <>
            <div>• Walk-away number: $___</div>
            <div>• First-line: &quot;___&quot;</div>
            <div>• Call date: ___</div>
            <div>• Cope to watch: ___</div>
          </>
        )}
      </div>
      <div className="text-xs text-wine-muted mt-2 font-mono">
        Log this in <code className="bg-cream-sand px-1 rounded">sessions/</code> when done.
      </div>
      {/* meta unused placeholder to silence TS */}
      <span className="hidden">{meta.id}</span>
    </div>
  );
}

function ExitPanel() {
  return (
    <div
      className="panel p-4"
      style={{
        borderColor: "#A14A38",
        boxShadow: "4px 4px 0px 0px #A14A38",
      }}
    >
      <div className="text-xs uppercase tracking-[0.2em] mb-2 font-mono font-bold" style={{ color: "#A14A38" }}>
        EXIT LINES.
      </div>
      <div className="text-xs text-wine-deep leading-relaxed space-y-2 font-mono">
        <div>&quot;Let me come back to this in writing.&quot;</div>
        <div>&quot;I want to think about this overnight.&quot;</div>
        <div>&quot;When can we revisit this on Tuesday?&quot;</div>
      </div>
      <div className="text-xs text-wine-muted mt-2 font-mono italic">
        Pick one. Do not negotiate down in real time.
      </div>
    </div>
  );
}

function UrgentTimer({ started }: { started: boolean }) {
  return (
    <div
      className="panel p-4"
      style={{
        borderColor: "#A14A38",
        boxShadow: "4px 4px 0px 0px #A14A38",
        background: "#FBE8E0",
      }}
    >
      <div className="text-xs uppercase tracking-[0.2em] mb-1 font-mono font-bold" style={{ color: "#A14A38" }}>
        LIVE CALL.
      </div>
      <div className="text-sm text-wine-deep font-mono">
        {started ? "Session active." : "You're about to type."}
      </div>
      <div className="text-xs text-wine-muted mt-2 font-mono leading-relaxed">
        Seconds matter. Coach gives one ground + one question per turn. Read fast. Act faster.
      </div>
    </div>
  );
}
