# 🥊 The Rate Hike Coach

> **For solo consultants who've been billing the same rate for 18+ months and freeze every time they think about telling a long-term client "I'm raising my rates."**
>
> The coach plays the client, drills you on the conversation, names your cope patterns by name, and refuses to let you flinch under push-back. Built on the **Abstraction Ladder Protocol** — every response checks whether you're avoiding the call because of fear or because of real strategy.

Not a calculator. Not a course. Not a pricing framework. A coach.

🎬 **Watch the 60-second demo:** https://rate-hike-coach.vercel.app *(auto-plays on landing)*
🌐 **Open the coach:** https://rate-hike-coach.vercel.app/coach
📂 **Or:** drop this folder into any Claude Project and you have the coach. No app required.

---

## What this actually is

This is a folder. The coach IS the folder. The web app at the link above is just a viewer on top of it.

Drop these files into a Claude Project. Tell Claude to read `identity.md` first, then `rules.md`. You now have the coach. Same coach. No app, no API key, no installation.

That's the point. The folder is portable, legible, and works without infrastructure. The web app is the productized version for people who want a polished UI and don't want to set up a Claude Project.

---

## See the difference in 30 seconds

Here's what makes this a coach, not a knowledge base. Same user input, two different systems:

**You say:** *"I want to raise my client's rate from $150 to $200. They've been with me 2 years and they've been so good to me. Should I do it?"*

---

**What ChatGPT (cold) says:**

> Raising rates with a long-term client can be a delicate matter. Here are 5 strategies to consider:
>
> 1. **Tie the increase to value.** Highlight the results you've delivered…
> 2. **Time it to a milestone.** Anniversary, project completion, or new year…
> 3. **Frame it as a market adjustment.** "My rates have increased across the board…"
> 4. **Offer a transition period.** Maybe a 3-month grandfathered rate…
> 5. **Be prepared for pushback.** Common objections include…
>
> Would you like me to draft a sample email you could send?

A lecture. A framework. A spreadsheet's worth of advice. You leave with 5 strategies and no movement.

---

**What this coach says:**

> That's the "they've been so good to me" pattern. I'm naming it because we're coming back to it.
>
> First: what specifically has been "so good"? Walk me through one example. One real moment. Not "they always pay on time" — a moment.

A question. A named cope. No advice. You leave Turn 1 having to actually look at what "good" means.

---

**Turn 2 — you say:** *"Well, they're easy to work with and they always renew."*

**ChatGPT:** "That's wonderful. Continuity is a sign of a strong relationship. Here are some ways to leverage that…"

**This coach:** "Easy to work with and they renew. That's the baseline of any client relationship. Not a reason to discount. What else?"

---

**Turn 3 — you say:** *"I don't want to upset the relationship."*

**ChatGPT:** "Understandable concern. Consider these techniques to soften the conversation…"

**This coach:** "The relationship is a story you tell yourself. The actual relationship is whatever survives the conversation. We're not going to talk about the rate until you tell me what you think will happen when you ask. Tell me the worst version."

---

That's the difference. It runs for 30 minutes. By the end, you have a walk-away number you've said out loud, a first-line you've rehearsed under pressure, and a date.

---

## Folder map

Each file does one job.

```
rate-hike-coach/
├── identity.md             ← Who the coach is. Manifesto with POV.
├── rules.md                ← Operating rules. Abstraction Ladder Protocol + Stage Contracts + Refusal List.
├── examples.md             ← 7 annotated good-coaching dialogues.
├── anti-examples.md        ← Side-by-side: knowledge-base mode vs coach mode.
├── working-theory.md       ← Live scaffold. Coach updates it as it learns about THIS user.
│
├── reference/
│   ├── abstraction-ladder.md       ← 4-rung model (hourly → packaged → outcome → licensed)
│   ├── cope-patterns.md            ← Named catalog of self-justifications
│   ├── walk-away-drills.md         ← Role-play scripts the coach uses to drill you
│   └── coaching-moments/
│       ├── pre-call.md             ← 24 hours before the real call
│       ├── mid-call-panic.md       ← 60-second protocol when you freeze mid-call
│       └── post-call-debrief.md    ← Structured debrief after a real call
│
├── patterns/                       ← Named coaching moves the coach uses
│   ├── pull-before-push.md
│   ├── name-the-cope.md
│   ├── hold-the-number.md
│   ├── walk-away-rehearsal.md
│   ├── relationship-vs-business.md
│   └── stage-contract-enforcement.md
│
├── sessions/                       ← Your longitudinal memory. Coach reads prior sessions.
│   └── README.md                   ← How to log sessions
│
├── tests/                          ← Drop the folder in Claude and run these. Each test has expected behavior.
│   └── test-prompts.md
│
├── cheat-sheet/                    ← Print it. Put it on your desk. Open during the real call.
│   └── rate-hike-cheat-sheet.md
│
└── playroom/                       ← Optional: Next.js web app version (see playroom/README.md)
```

**14 files, every one with a job.** Nothing exists "just in case." If you don't know why a file is here, the coach doesn't need it.

---

## How to use it

### Option 1: Drop into Claude Project (recommended for first-time)

1. Create a new Claude Project at https://claude.ai/projects
2. Upload this entire folder as Project Knowledge
3. Start a conversation with: *"Read identity.md, then rules.md. We're starting a session."*
4. Begin Intake. Tell the coach about the client.

The session runs ~30 minutes. End with a commitment. Paste the coach's session log into `sessions/` so the coach remembers next time.

### Option 2: Run the web app (The Rehearsal Room)

```bash
cd playroom
npm install
cp .env.local.example .env.local
# add your Anthropic API key
npm run dev
```

Opens at http://localhost:3000 with the visual UI:
- Streaming chat with the coach
- Stage Indicator showing your phase (Intake → Reflect → Drill → Commit)
- Cope Panel that flags self-justification patterns as you type them
- 30-minute session timer

### Option 3: Use the live deployed app

**👉 Demo + coach:** https://rate-hike-coach.vercel.app

The landing page auto-plays a 55-second demo. The "Open the coach →" button at the end (or the "Skip to coach →" link at top-right) drops you straight into `/coach`. No setup. No API key. Server-side Anthropic.

---

## The Abstraction Ladder Protocol (the named operating mechanism)

Every coach response checks: **what rung are you operating at, and are you trying to negotiate at the wrong rung?**

```
RUNG 4 — LICENSED         (selling your system as IP)
RUNG 3 — OUTCOME          (selling a result, not deliverables)
RUNG 2 — PACKAGED         (selling a fixed-scope offer)
RUNG 1 — HOURLY           (selling your time)        ← most consultants stuck here
```

If you're stuck at Rung 1, the coach surfaces the rung mismatch before optimizing your 33% hourly increase. The rate hike is rarely just about the hourly number. It's usually about the rung underneath.

See `reference/abstraction-ladder.md` for the full diagnostic.

---

## Why the structure looks this way

This is built on **Interpretable Context Methodology** ([Van Clief & McDermott, 2026](https://eduba.io)). The folder isn't decoration — the folder IS the coach's architecture. Each file does one job. Routing is explicit. Skills (patterns/) are loaded when needed.

The reason it works: Claude (or any capable agent) navigates the folder structure to load only the context that matters for the current task. No vector embedding, no RAG pipeline, no orchestration framework. Just folders and markdown.

This entry treats the methodology as the substrate, not a sticker.

---

## You'll know it's working when

- The coach asks you a question in turn 1 instead of giving advice
- The coach names a cope pattern by name within the first 3 turns
- The coach refuses to write your email
- The coach refuses to give you a specific number
- The coach role-plays as your client and you can feel the pressure
- You leave the session with 4 specifics (number, first-line, date, named cope), not a feeling

If the coach gives you a list of 5 strategies in response to your first question, it's broken. Restart the project.

---

## Stage Contracts

Sessions have four phases. The coach refuses to skip.

| Phase | Time | What the coach does | What you do |
|-------|------|---------------------|-------------|
| 1. Intake | 5–10 min | Asks only. No advice. | Tell the story. Concrete examples. |
| 2. Reflect | 5 min | Names patterns it heard. | Acknowledge or push back. |
| 3. Drill | 10–15 min | Plays your client. Escalates pressure. | Hold your number under counter-moves. |
| 4. Commit | 3–5 min | Extracts the four specifics. | State number, line, date, named cope out loud. |

---

## The refusal list

The coach will NOT:

- Write the email to your client.
- Write the script for the call.
- Give you a specific dollar amount.
- Tell you whether to raise rates.
- Reassure you that it'll go well.
- Coddle you when you express fear.
- Skip Intake to get to advice faster.
- Engage on topics outside rate-hike coaching without flagging it.

These refusals are not bugs. They're the difference between a coach and a tool.

---

## Test it yourself

`tests/test-prompts.md` has 15 specific tests with expected behaviors. Drop the folder in a Claude Project and run them. If any fail, the coach is broken — open an issue.

Examples:

- **Test 1:** *"Should I raise my rates?"* → Coach asks a question, does NOT advise.
- **Test 4:** *"They've been so good to me."* → Coach names the pattern by that exact name.
- **Test 8:** *"Just tell me what to charge."* → Coach refuses. Says: *"I will not give you a number. Numbers from me will not survive the client's silence."*

---

## Stretch goals (post-comp)

- [ ] Wire the session timer to actually pause the coach at 30 min
- [ ] Auto-write session logs from the deployed app (currently manual paste)
- [ ] Add a "previous sessions" reader to the playroom UI
- [ ] Add audio mode (voice input + TTS coach responses)
- [ ] Build sibling coaches: Discovery Call Coach, Productization Coach

---

## License

MIT. Use it. Fork it. Build coaches for other domains using this shape. If you ship one, link back so I can see what you built.

---

## Submission

Built for **Weekly Comp #5 — The Coach** in the Cleaf Notes / EDUBA community.

> The Rate Hike Coach — for solo consultants who've been billing the same rate for 18+ months and freeze every time they think about telling a long-term client "I'm raising my rates." The coach plays the client, drills you on the conversation, names your cope patterns by name, and refuses to let you flinch under push-back. Built on the Abstraction Ladder Protocol — every response checks whether you're avoiding the call because of fear or because of real strategy.

Folder + web app. Same coach, two surfaces.
