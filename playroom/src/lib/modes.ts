/**
 * Game-time mode metadata — shared by mode picker, session pages, and ChatInterface.
 */

export type Mode = "pre-game" | "halftime" | "timeout" | "post-game";

export type ModeMeta = {
  id: Mode;
  emoji: string;
  label: string;
  subtitle: string;
  when: string;
  description: string;
  accentClass: string;
  accentHex: string;
  shadowHex: string;
  bgTint: string;
  borderTint: string;
  emptyStateTitle: string;
  emptyStateLines: string[];
  emptyStateFooter: string;
  inputPlaceholder: string;
  stages: { id: string; label: string; description: string }[];
};

export const MODES: Record<Mode, ModeMeta> = {
  "pre-game": {
    id: "pre-game",
    emoji: "🏋️",
    label: "Pre-Game",
    subtitle: "Drill before the call.",
    when: "24–48 hours before the real conversation.",
    description:
      "Full 4-phase rehearsal. Intake → Reflect → Drill → Commit. Walk-away number locked. First-line rehearsed. Cope catalog primed.",
    accentClass: "wine",
    accentHex: "#5D3136",
    shadowHex: "#4A2C2A",
    bgTint: "#FEFBF6",
    borderTint: "#5D3136",
    emptyStateTitle: "Pre-Game.",
    emptyStateLines: [
      "Tell the coach about the client.",
      "Two years. Same rate. You're about to ask for more.",
      "Start with that.",
    ],
    emptyStateFooter: "No numbers. No scripts. No emails.",
    inputPlaceholder: "Tell the coach about the client. Concrete. One example.",
    stages: [
      { id: "intake", label: "Intake", description: "Tell the story. Coach only asks." },
      { id: "reflect", label: "Reflect", description: "Coach names what it heard." },
      { id: "drill", label: "Drill", description: "Coach plays the client." },
      { id: "commit", label: "Commit", description: "Number, line, date." },
    ],
  },

  "halftime": {
    id: "halftime",
    emoji: "🔄",
    label: "Halftime",
    subtitle: "Reset mid-session.",
    when: "You've been rehearsing. Something isn't landing.",
    description:
      "Skip Intake. Coach names the meta-pattern across your session, proposes one specific reset, and re-enters Drill from a new angle.",
    accentClass: "dusty",
    accentHex: "#7B5A5C",
    shadowHex: "#5D3136",
    bgTint: "#F9ECDF",
    borderTint: "#7B5A5C",
    emptyStateTitle: "Halftime.",
    emptyStateLines: [
      "What's been blocking you in the rehearsal?",
      "The cope you can't shake. The line you keep softening.",
      "Name it. The coach will pick the reset.",
    ],
    emptyStateFooter: "Adjustment. Not restart.",
    inputPlaceholder: "Tell the coach what's been spiraling.",
    stages: [
      { id: "reset", label: "Reset", description: "Coach names the meta-pattern." },
      { id: "redrill", label: "Re-Drill", description: "New angle. Same energy." },
      { id: "commit", label: "Commit", description: "Number, line, date — possibly amended." },
    ],
  },

  "timeout": {
    id: "timeout",
    emoji: "⏱️",
    label: "Timeout",
    subtitle: "You're on the call. Right now.",
    when: "Client is on the line. You froze. 60-second protocol.",
    description:
      "Emergency triage. One grounding line. One question to buy time. Exit line if needed. Every response under 80 words.",
    accentClass: "warn",
    accentHex: "#A14A38",
    shadowHex: "#7C3826",
    bgTint: "#FBE8E0",
    borderTint: "#A14A38",
    emptyStateTitle: "Timeout.",
    emptyStateLines: [
      "Type fast.",
      "What did they just say?",
      "Or — what are you about to say that you'll regret?",
    ],
    emptyStateFooter: "You have seconds, not minutes.",
    inputPlaceholder: "Type what just happened on the call.",
    stages: [
      { id: "ground", label: "Ground", description: "Coach gives one steadying line." },
      { id: "buy-time", label: "Buy Time", description: "One question for the client." },
      { id: "exit", label: "Exit", description: "Walk-away line if needed." },
    ],
  },

  "post-game": {
    id: "post-game",
    emoji: "📓",
    label: "Post-Game",
    subtitle: "Debrief the real call.",
    when: "The conversation happened. Audit it.",
    description:
      "Forensic structure. What did you actually say? Where did you flinch? Which cope showed up? What gets logged so next call goes differently?",
    accentClass: "ok",
    accentHex: "#5A7A4E",
    shadowHex: "#3F5836",
    bgTint: "#F0EFE4",
    borderTint: "#5A7A4E",
    emptyStateTitle: "Post-Game.",
    emptyStateLines: [
      "The call happened.",
      "Tell the coach what you actually said.",
      "Exact words. Not summary.",
    ],
    emptyStateFooter: "Audit. Not closure.",
    inputPlaceholder: "What you actually said on the call. Verbatim if you can.",
    stages: [
      { id: "what-happened", label: "What Happened", description: "Exact words from the call." },
      { id: "flinch", label: "Where You Flinched", description: "The specific moment." },
      { id: "pattern", label: "Pattern", description: "Which cope showed up." },
      { id: "log", label: "Log", description: "What goes to sessions/ for next time." },
    ],
  },
};

export const MODE_ORDER: Mode[] = ["pre-game", "halftime", "timeout", "post-game"];
