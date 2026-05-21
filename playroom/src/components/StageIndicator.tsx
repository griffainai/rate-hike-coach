"use client";

export type Stage = "intake" | "reflect" | "drill" | "commit";

const STAGES: { id: Stage; label: string; description: string }[] = [
  { id: "intake", label: "Intake", description: "Tell the story. Coach only asks." },
  { id: "reflect", label: "Reflect", description: "Coach names what it heard." },
  { id: "drill", label: "Drill", description: "Coach plays the client." },
  { id: "commit", label: "Commit", description: "Number, line, date." },
];

export function StageIndicator({ current }: { current: Stage }) {
  const currentIdx = STAGES.findIndex((s) => s.id === current);

  return (
    <div className="panel p-4">
      <div className="text-xs uppercase tracking-wider text-accent-coach/50 mb-3">
        Stage Contracts
      </div>
      <div className="space-y-2">
        {STAGES.map((stage, idx) => {
          const state =
            idx < currentIdx ? "done" : idx === currentIdx ? "active" : "upcoming";
          return (
            <div
              key={stage.id}
              className={`flex items-start gap-3 p-2 rounded transition-colors ${
                state === "active" ? "bg-bg-card" : ""
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                  state === "done"
                    ? "bg-accent-ok text-bg"
                    : state === "active"
                      ? "bg-accent-user text-bg"
                      : "bg-bg-border text-accent-coach/50"
                }`}
              >
                {state === "done" ? "✓" : idx + 1}
              </div>
              <div>
                <div
                  className={`text-sm font-medium ${
                    state === "upcoming"
                      ? "text-accent-coach/50"
                      : "text-accent-coach"
                  }`}
                >
                  {stage.label}
                </div>
                <div className="text-xs text-accent-coach/40 leading-snug">
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
 * Heuristic stage inference from the coach's recent messages.
 * In a fuller build, the coach would emit a stage signal explicitly.
 * For now we look at the assistant's most recent message for hints.
 */
export function inferStage(messages: { role: string; content: string }[]): Stage {
  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  if (!lastAssistant) return "intake";
  const t = lastAssistant.content.toLowerCase();

  // Commit signals
  if (
    t.includes("walk-away") ||
    t.includes("walk away number") ||
    t.includes("commit") ||
    t.includes("by friday") ||
    /\$\d+/.test(t)
  ) {
    if (
      t.includes("commit") ||
      t.includes("date") ||
      t.includes("when will you")
    ) {
      return "commit";
    }
  }

  // Drill signals (coach role-playing as client)
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

  // Reflect signals (coach naming patterns)
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
