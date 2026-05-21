/**
 * Cope-pattern detector
 *
 * Runs over user messages and flags self-justification patterns the coach
 * names by name. This is a deterministic side-channel that runs alongside
 * the coach's own reasoning — the UI surfaces detected patterns visually
 * even before the coach references them.
 *
 * Patterns mirror the catalog in ../../cope-patterns.md.
 */

export type CopePattern = {
  id: string;
  name: string;
  triggers: RegExp[];
  underneath: string;
};

export const COPE_PATTERNS: CopePattern[] = [
  {
    id: "so-good-to-me",
    name: "They've been so good to me",
    triggers: [
      /they(?:'ve| have)? been (?:so|really|very|amazing|incredible) good/i,
      /good (?:to|for) me/i,
      /loyal (?:client|customer)/i,
      /(?:long[\s-]?term|long[\s-]?standing) relationship/i,
    ],
    underneath: "Loyalty cope. Reluctance to risk a relationship that may already be transactional.",
  },
  {
    id: "now-isnt-the-time",
    name: "Now isn't the right time",
    triggers: [
      /now\s+isn'?t\s+the\s+right\s+time/i,
      /bad\s+(?:time|timing)/i,
      /(?:not|wrong)\s+the\s+(?:right\s+)?(?:moment|time)/i,
      /(?:wait|hold off)\s+(?:until|till|for)/i,
      /timing\s+is\s+off/i,
    ],
    underneath: "Indefinite deferral. There is no defined future condition that would make it 'the right time.'",
  },
  {
    id: "theyll-find-cheaper",
    name: "They'll find someone cheaper",
    triggers: [
      /find\s+(?:someone|somebody)\s+(?:cheaper|else)/i,
      /(?:other|cheaper)\s+(?:vendors?|consultants?|providers?)/i,
      /(?:lose|losing)\s+them/i,
      /they(?:'ll| will)?\s+walk/i,
    ],
    underneath: "Catastrophizing. The client's hypothetical departure is being used as preemptive surrender.",
  },
  {
    id: "havent-earned-it",
    name: "I haven't earned it yet",
    triggers: [
      /haven'?t\s+earned/i,
      /not\s+(?:yet\s+)?(?:worth|deserve)/i,
      /(?:need|should)\s+to\s+prove/i,
      /imposter/i,
      /not\s+(?:senior|experienced)\s+enough/i,
    ],
    underneath: "Imposter cope. Asking the client to validate your worth instead of asserting it.",
  },
  {
    id: "next-year-for-sure",
    name: "I'll raise rates next year for sure",
    triggers: [
      /next\s+year/i,
      /(?:in|by)\s+(?:the\s+)?(?:new\s+)?year/i,
      /q[1-4]\s+(?:next|of next)/i,
      /(?:end of|beginning of)\s+(?:the\s+)?year/i,
    ],
    underneath: "Future-self cope. Outsourcing the decision to a person who will not exist when the date arrives.",
  },
  {
    id: "what-if-they-ask",
    name: "What if they ask me to justify it",
    triggers: [
      /(?:what|how)\s+(?:if|do)\s+(?:they|the client)\s+(?:ask|push)/i,
      /justify\s+(?:the|my|a)\s+(?:rate|raise|increase|hike)/i,
      /(?:need|have)\s+to\s+explain/i,
      /push\s+back/i,
    ],
    underneath: "Pre-emptive negotiating against yourself. You are rehearsing their objection before they raise it.",
  },
  {
    id: "grandfather-old-rate",
    name: "I should grandfather them at the old rate",
    triggers: [
      /grandfather/i,
      /(?:keep|stay)\s+(?:at|on)\s+(?:the\s+)?old\s+rate/i,
      /(?:existing|current)\s+clients?\s+(?:stay|keep|remain)/i,
      /only\s+new\s+clients?/i,
    ],
    underneath: "Loyalty tax. Permanently penalizing yourself to avoid one conversation.",
  },
  {
    id: "not-worth-it-yet",
    name: "I'm not worth that rate yet",
    triggers: [
      /(?:not|don'?t feel)\s+worth/i,
      /(?:my|the)\s+work\s+isn'?t\s+worth/i,
      /am\s+i\s+worth/i,
      /worth\s+that\s+much/i,
    ],
    underneath: "Self-discount. You are pricing the fear, not the work.",
  },
  {
    id: "scare-them-off",
    name: "I don't want to scare them off",
    triggers: [
      /scare\s+them/i,
      /(?:freak|put)\s+(?:them|the client)\s+(?:out|off)/i,
      /(?:lose|losing)\s+(?:their|the)\s+business/i,
      /risk\s+(?:the|losing)\s+(?:client|relationship)/i,
    ],
    underneath: "Avoidance cope. The conversation feels riskier than the slow erosion of your rate.",
  },
];

export type DetectedPattern = {
  id: string;
  name: string;
  underneath: string;
  matchedText: string;
};

export function detectCope(text: string): DetectedPattern[] {
  const hits: DetectedPattern[] = [];
  const seen = new Set<string>();
  for (const pattern of COPE_PATTERNS) {
    for (const trigger of pattern.triggers) {
      const m = text.match(trigger);
      if (m && !seen.has(pattern.id)) {
        seen.add(pattern.id);
        hits.push({
          id: pattern.id,
          name: pattern.name,
          underneath: pattern.underneath,
          matchedText: m[0],
        });
        break;
      }
    }
  }
  return hits;
}
