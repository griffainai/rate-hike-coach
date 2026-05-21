# The Rehearsal Room

A visual interface for the Rate Hike Coach. Same coach — different surface.

The coach's brain lives in the markdown files one level up (`../identity.md`, `../rules.md`, `../reference/*`). This Next.js app reads those files at request time, feeds them to Claude as the system prompt, and gives you a chat UI with live cope-pattern detection, session timing, and stage tracking.

The point of the dual surface: **you can drop the folder into Claude Projects and get the same coach, no app required.** The app is a viewer. The folder is the coach. Move the folder anywhere and it works.

---

## Run locally

```bash
cd playroom
npm install
cp .env.local.example .env.local
# edit .env.local and paste your Anthropic API key
npm run dev
```

Open http://localhost:3000.

---

## Deploy to Vercel

```bash
cd playroom
vercel
```

When Vercel prompts:
- Link to your account
- Project name: `rate-hike-coach`
- Root directory: `playroom` (this folder)
- Override settings: No

Then set the env var:

```bash
vercel env add ANTHROPIC_API_KEY
# paste your key, select Production / Preview / Development
vercel deploy --prod
```

---

## What the UI shows

- **Chat panel** — your conversation with the coach, streaming responses.
- **Stage Indicator** — which phase of the session you're in (Intake → Reflect → Drill → Commit). Inferred heuristically from the coach's messages.
- **Cope Panel** — pattern names that fire on your input (e.g. "they've been so good to me", "now isn't the right time"). The coach also names these itself; this is a parallel deterministic signal.
- **Session Timer** — 30-minute cap. Coach holds the limit.
- **Commit Panel** — appears when the coach moves to Phase 4. Prompts you for your number, first-line, call date, and named cope.

---

## What the UI does NOT do

It does not replace the coach. The coach is the markdown files. If you wanted, you could:

- Drop `../identity.md`, `../rules.md`, and `../reference/` into a Claude Project.
- Get exactly the same coach, no UI.

This is the recursive proof Jake's methodology is about: same content, two surfaces.

---

## Architecture

```
playroom/
├── src/
│   ├── app/
│   │   ├── page.tsx                ← Top-level layout
│   │   ├── layout.tsx              ← Body shell + globals
│   │   ├── globals.css             ← Tailwind + scoped styles
│   │   └── api/coach/route.ts      ← POST /api/coach — streams to Claude
│   ├── components/
│   │   ├── ChatInterface.tsx       ← Main chat + sidebar composition
│   │   ├── StageIndicator.tsx      ← 4-phase Stage Contracts view
│   │   ├── CopePanel.tsx           ← Detected pattern visualizer
│   │   └── SessionTimer.tsx        ← 30-min countdown
│   └── lib/
│       ├── coach-context.ts        ← Reads ../*.md and assembles system prompt
│       └── cope-detector.ts        ← Regex-based pattern detection
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── .env.local.example
```

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | yes | Your Anthropic key. The coach cannot respond without it. |
| `ANTHROPIC_MODEL` | no | Override default model (`claude-sonnet-4-5`). |

---

## Prompt caching

The system prompt (identity + rules + reference) is large. We mark it with `cache_control: ephemeral` so repeated turns in the same session don't re-pay input tokens. Drops cost ~90% on continued sessions.
