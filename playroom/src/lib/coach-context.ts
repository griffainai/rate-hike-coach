/**
 * Coach context loader
 *
 * The Rehearsal Room is just a UI on top of the coach folder. The coach's
 * brain lives in the markdown files at the repo root. This module reads
 * those files at request time and assembles them into the system prompt.
 *
 * Why read at request time instead of build time:
 * - You can edit identity.md / rules.md and the coach updates without a redeploy.
 * - The recursive ICM thesis: the folder IS the coach. The UI is a viewer.
 *
 * Reads:
 *   ../identity.md
 *   ../rules.md
 *   ../reference/abstraction-ladder.md
 *   ../reference/cope-patterns.md
 *   ../reference/walk-away-drills.md
 *   ../reference/coaching-moments/*.md
 */

import { promises as fs } from "fs";
import path from "path";

const COACH_ROOT = path.resolve(process.cwd(), "..");

async function readSafe(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return "";
  }
}

export async function loadCoachSystemPrompt(): Promise<string> {
  const identity = await readSafe(path.join(COACH_ROOT, "identity.md"));
  const rules = await readSafe(path.join(COACH_ROOT, "rules.md"));
  const abstractionLadder = await readSafe(
    path.join(COACH_ROOT, "reference", "abstraction-ladder.md")
  );
  const copePatterns = await readSafe(
    path.join(COACH_ROOT, "reference", "cope-patterns.md")
  );
  const walkAwayDrills = await readSafe(
    path.join(COACH_ROOT, "reference", "walk-away-drills.md")
  );

  const momentsDir = path.join(COACH_ROOT, "reference", "coaching-moments");
  const momentFiles = await fs.readdir(momentsDir).catch(() => []);
  const moments = (
    await Promise.all(
      momentFiles
        .filter((f) => f.endsWith(".md"))
        .map(async (f) => {
          const content = await readSafe(path.join(momentsDir, f));
          return `### ${f}\n\n${content}`;
        })
    )
  ).join("\n\n---\n\n");

  return `You are the Rate Hike Coach. The files below define who you are, how you operate, and what you refuse to do. Read them as your operating constitution, not as background reading.

# IDENTITY

${identity}

---

# RULES

${rules}

---

# REFERENCE: ABSTRACTION LADDER

${abstractionLadder}

---

# REFERENCE: COPE PATTERNS

${copePatterns}

---

# REFERENCE: WALK-AWAY DRILLS

${walkAwayDrills}

---

# REFERENCE: COACHING MOMENTS

${moments}

---

# OPERATIONAL NOTES

You are running inside The Rehearsal Room — a web interface. The user is interacting with you through a chat UI. They are likely a real solo consultant in real preparation for a real conversation.

Behavioral reminders:
- Hold the Stage Contracts. Phase 1 is Intake — you ask, you do not advise.
- Name cope patterns by name when they appear.
- Refuse to write the email, the script, or a specific number. The user must produce these themselves under your drilling.
- When the user asks you to play their client, play the client. Escalate pressure. Make them earn the hold.
- Sessions are 30 minutes max. If the user has been going long, name it.
- Speak in plain English. No bullet-point lectures. No "here are 5 strategies."`;
}
