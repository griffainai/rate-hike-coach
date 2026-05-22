"use client";

import { Mode, MODES } from "@/lib/modes";

export type Stage = string;

export function StageIndicator({ current, mode }: { current: Stage; mode: Mode }) {
  const meta = MODES[mode];
  const stages = meta.stages;
  const currentIdx = stages.findIndex((s) => s.id === current);

  return (
    <div className="panel p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-wine font-mono font-bold mb-3">
        {mode === "timeout" ? "PROTOCOL." : "STAGE CONTRACTS."}
      </div>
      <div className="space-y-2">
        {stages.map((stage, idx) => {
          const state =
            idx < currentIdx ? "done" : idx === currentIdx ? "active" : "upcoming";
          return (
            <div
              key={stage.id}
              className={`flex items-start gap-3 p-2 rounded transition-colors ${
                state === "active" ? "bg-cream" : ""
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5 border-2 ${
                  state === "done"
                    ? "bg-accent-ok border-wine-deep text-cream"
                    : state === "active"
                      ? "border-wine-deep text-wine-deep"
                      : "bg-cream-sand border-cream-dusty text-wine-soft"
                }`}
                style={state === "active" ? { background: meta.accentHex === "#5D3136" ? "#C89F4B" : meta.bgTint } : undefined}
              >
                {state === "done" ? "✓" : idx + 1}
              </div>
              <div>
                <div
                  className={`text-sm font-mono font-medium ${
                    state === "upcoming"
                      ? "text-wine-soft"
                      : "text-wine-deep"
                  }`}
                >
                  {stage.label}
                </div>
                <div className="text-xs text-wine-muted leading-snug">
                  {stage.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Heuristic stage inference per mode.
 */
export function inferStage(messages: { role: string; content: string }[], mode: Mode): Stage {
  const meta = MODES[mode];
  const stages = meta.stages.map((s) => s.id);
  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  if (!lastAssistant) return stages[0];

  const t = lastAssistant.content.toLowerCase();

  if (mode === "pre-game") {
    if (
      (t.includes("commit") && (t.includes("date") || t.includes("when will you"))) ||
      t.includes("walk-away") ||
      /\$\d+/.test(t)
    ) {
      return "commit";
    }
    if (
      t.includes("[client]") ||
      t.includes("as the client") ||
      t.includes("playing the client") ||
      t.includes("let's drill") ||
      t.includes("budgeted") ||
      t.includes("that's a big jump")
    ) {
      return "drill";
    }
    if (
      t.includes("pattern") ||
      t.includes("cope") ||
      t.includes("that's the") ||
      t.includes("i'm hearing")
    ) {
      return "reflect";
    }
    return "intake";
  }

  if (mode === "halftime") {
    if (t.includes("commit") || t.includes("walk-away") || /\$\d+/.test(t)) return "commit";
    if (t.includes("[client]") || t.includes("let's run") || t.includes("drill")) return "redrill";
    return "reset";
  }

  if (mode === "timeout") {
    if (t.includes("come back to this in writing") || t.includes("end the call") || t.includes("walk")) return "exit";
    if (t.includes("ask them") || t.includes("buy time") || t.includes("?")) return "buy-time";
    return "ground";
  }

  if (mode === "post-game") {
    if (t.includes("log") || t.includes("sessions/") || t.includes("next call")) return "log";
    if (t.includes("pattern") || t.includes("cope") || t.includes("that's the")) return "pattern";
    if (t.includes("flinch") || t.includes("soften")) return "flinch";
    return "what-happened";
  }

  return stages[0];
}
