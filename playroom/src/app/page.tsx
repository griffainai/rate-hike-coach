"use client";

import { useEffect, useState } from "react";

/* ============================================================
 * HOMEPAGE = DEMO SLIDESHOW
 * 7 scenes, ~55 seconds, auto-advance with manual override.
 * Same EDUBA palette as the rest of the app.
 * Pure CSS animations + React state for sequencing.
 * Visitors arriving at / watch this first; CTA → /coach
 * ============================================================ */

const SCENE_DURATIONS_MS = [5000, 5500, 9500, 10500, 7500, 7500, 6500];
const TOTAL_SCENES = SCENE_DURATIONS_MS.length;

export default function HomePage() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (paused || done) return;
    if (sceneIdx >= TOTAL_SCENES - 1) {
      const t = setTimeout(() => setDone(true), SCENE_DURATIONS_MS[sceneIdx]);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setSceneIdx((i) => i + 1),
      SCENE_DURATIONS_MS[sceneIdx]
    );
    return () => clearTimeout(t);
  }, [sceneIdx, paused, done]);

  function reset() {
    setSceneIdx(0);
    setDone(false);
    setPaused(false);
  }

  return (
    <main className="min-h-screen flex flex-col bg-cream text-wine-deep relative overflow-hidden">
      <nav className="absolute top-4 right-5 z-20 flex items-center gap-3 font-mono text-xs uppercase tracking-wider">
        <a
          href="/coach"
          className="text-wine-muted hover:text-wine transition-colors px-2 py-1"
        >
          Skip to coach →
        </a>
      </nav>

      <div className="absolute top-4 left-5 z-20 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-wine-muted">
        <span>🥊</span>
        <span className="font-bold">The Rate Hike Coach</span>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 md:px-16 py-20">
        <SceneRouter index={sceneIdx} />
      </div>

      <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-3 z-20">
        <ProgressDots current={sceneIdx} total={TOTAL_SCENES} />
        <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-wider text-wine-muted">
          <button onClick={() => setPaused((p) => !p)} className="hover:text-wine transition-colors px-2 py-1">
            {paused ? "▶ Play" : "❚❚ Pause"}
          </button>
          <button onClick={() => setSceneIdx((i) => Math.max(0, i - 1))} className="hover:text-wine transition-colors px-2 py-1">
            ← Back
          </button>
          <button onClick={() => setSceneIdx((i) => Math.min(TOTAL_SCENES - 1, i + 1))} className="hover:text-wine transition-colors px-2 py-1">
            Next →
          </button>
          <button onClick={reset} className="hover:text-wine transition-colors px-2 py-1">
            ↻ Restart
          </button>
        </div>
      </div>

      {done && <DoneOverlay onReplay={reset} />}
    </main>
  );
}

function SceneRouter({ index }: { index: number }) {
  switch (index) {
    case 0: return <Scene1 key="s1" />;
    case 1: return <Scene2 key="s2" />;
    case 2: return <Scene3 key="s3" />;
    case 3: return <Scene4 key="s4" />;
    case 4: return <Scene5 key="s5" />;
    case 5: return <Scene6 key="s6" />;
    case 6: return <Scene7 key="s7" />;
    default: return null;
  }
}

function useTypewriter(text: string, opts?: { speed?: number; startDelay?: number }) {
  const speed = opts?.speed ?? 25;
  const startDelay = opts?.startDelay ?? 0;
  const [out, setOut] = useState("");

  useEffect(() => {
    setOut("");
    let cancelled = false;
    let i = 0;
    const startT = setTimeout(() => {
      const tick = () => {
        if (cancelled) return;
        i++;
        setOut(text.slice(0, i));
        if (i < text.length) {
          setTimeout(tick, speed);
        }
      };
      tick();
    }, startDelay);
    return () => {
      cancelled = true;
      clearTimeout(startT);
    };
  }, [text, speed, startDelay]);

  return out;
}

function Scene1() {
  return (
    <div className="text-center max-w-5xl mx-auto stagger">
      <div className="size-small font-mono font-bold text-wine-muted mb-6 uppercase" style={{ animationDelay: "0ms" }}>
        Most AI coaches.
      </div>
      <div className="font-mono font-bold text-wine size-mega mb-8" style={{ animationDelay: "400ms" }}>
        Are knowledge bases in a trench coat.
      </div>
      <div className="size-large font-mono font-bold text-wine-deep" style={{ animationDelay: "1800ms" }}>
        This one isn&apos;t.
      </div>
    </div>
  );
}

function Scene2() {
  return (
    <div className="text-center max-w-4xl mx-auto stagger">
      <div className="size-small font-mono font-bold text-wine-muted mb-6 uppercase" style={{ animationDelay: "0ms" }}>
        For the consultant.
      </div>
      <div className="space-y-3 font-mono">
        <div className="size-medium text-wine-deep font-medium" style={{ animationDelay: "400ms" }}>
          Same rate. Eighteen months.
        </div>
        <div className="size-medium text-wine-deep font-medium" style={{ animationDelay: "1100ms" }}>
          Two-year client. Long-term relationship.
        </div>
        <div className="size-large font-bold text-wine mt-6" style={{ animationDelay: "1800ms" }}>
          Asking for more terrifies them.
        </div>
      </div>
    </div>
  );
}

function Scene3() {
  const prompt = useTypewriter(
    "I want to raise my client's rate from $150 to $200. They've been with me 2 years and they've been so good to me. Should I do it?",
    { speed: 14, startDelay: 600 }
  );

  const promptDone = prompt.length > 100;
  const response = useTypewriter(
    "Here are 5 strategies to consider:\n1. Tie the increase to value delivered\n2. Time it to a milestone\n3. Frame as a market adjustment\n4. Offer a transition period\n5. Be prepared for pushback\n\nWould you like me to draft a sample email?",
    { speed: 8, startDelay: promptDone ? 0 : 3500 }
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="size-small font-mono font-bold text-wine-muted mb-5 uppercase scene-fade-up">
        Ask ChatGPT cold.
      </div>

      <div className="mock-bubble-prompt mb-4 scene-fade-up" style={{ animationDelay: "200ms" }}>
        <span className={prompt.length < 100 ? "caret" : ""}>{prompt}</span>
      </div>

      <div className="mock-bubble mb-4 scene-fade-up" style={{ animationDelay: "3500ms", minHeight: "180px" }}>
        <div className="text-xs font-mono uppercase tracking-wider text-wine-muted mb-2">ChatGPT</div>
        <pre className="font-sans text-sm whitespace-pre-wrap leading-relaxed">{response}</pre>
      </div>

      <div className="size-small font-mono font-bold text-wine uppercase text-right scene-fade-up" style={{ animationDelay: "8000ms" }}>
        A workshop. Not a coach.
      </div>
    </div>
  );
}

function Scene4() {
  const prompt = useTypewriter(
    "I want to raise my client's rate from $150 to $200. They've been with me 2 years and they've been so good to me. Should I do it?",
    { speed: 12, startDelay: 600 }
  );

  const promptDone = prompt.length > 100;
  const response = useTypewriter(
    "That's the \"they've been so good to me\" pattern.\n\nWalk me through one specific example. One real moment. Not \"they always pay on time\" — a moment.",
    { speed: 18, startDelay: promptDone ? 0 : 3500 }
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="size-small font-mono font-bold text-wine-muted mb-5 uppercase scene-fade-up">
        Ask the Rate Hike Coach.
      </div>

      <div className="mock-bubble-prompt mb-4 scene-fade-up" style={{ animationDelay: "200ms" }}>
        <span className={prompt.length < 100 ? "caret" : ""}>{prompt}</span>
      </div>

      <div
        className="mock-bubble mb-4 scene-fade-up"
        style={{
          animationDelay: "3500ms",
          minHeight: "140px",
          background: "#F9ECDF",
          borderLeftWidth: "8px",
          borderLeftColor: "#A14A38",
        }}
      >
        <div className="text-xs font-mono uppercase tracking-wider text-wine mb-2 font-bold">The Coach</div>
        <pre className="font-sans text-base whitespace-pre-wrap leading-relaxed text-wine-deep">{response}</pre>
      </div>

      <div className="flex justify-between items-center scene-fade-up flex-wrap gap-2" style={{ animationDelay: "7500ms" }}>
        <div className="size-small font-mono font-bold uppercase" style={{ color: "#A14A38" }}>
          ⚠ Cope detected: &quot;they&apos;ve been so good to me&quot;
        </div>
        <div className="size-small font-mono font-bold text-wine uppercase text-right">
          One cope. One question. No advice.
        </div>
      </div>
    </div>
  );
}

function Scene5() {
  return (
    <div className="text-center max-w-4xl mx-auto stagger">
      <div className="size-small font-mono font-bold text-wine-muted mb-6 uppercase" style={{ animationDelay: "0ms" }}>
        The trick.
      </div>
      <div className="size-medium font-mono text-wine-deep mb-4" style={{ animationDelay: "500ms" }}>
        The coach isn&apos;t the app.
      </div>
      <div className="size-large font-mono font-bold text-wine mb-10" style={{ animationDelay: "1300ms" }}>
        The coach is the folder.
      </div>

      <div className="flex items-center justify-center gap-6 md:gap-10 my-10 flex-wrap" style={{ animationDelay: "2200ms" }}>
        <SurfaceIcon icon="📁" label="Folder" sub="identity.md / rules.md" />
        <Arrow />
        <SurfaceIcon icon="🥊" label="Coach" sub="same brain" highlight />
        <Arrow />
        <SurfaceIcon icon="🌐" label="App" sub="this site" />
      </div>

      <div className="size-medium font-mono font-bold text-wine-deep" style={{ animationDelay: "3500ms" }}>
        Same coach. Two surfaces.
      </div>
    </div>
  );
}

function SurfaceIcon({ icon, label, sub, highlight = false }: { icon: string; label: string; sub: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center font-mono">
      <div
        className={`w-24 h-24 md:w-32 md:h-32 flex items-center justify-center text-5xl md:text-6xl rounded-lg border-3 ${
          highlight ? "border-wine-deep" : "border-wine"
        } bg-cream-warm`}
        style={{
          boxShadow: highlight ? "5px 5px 0px 0px #4A2C2A" : "4px 4px 0px 0px #5D3136",
        }}
      >
        {icon}
      </div>
      <div className="mt-3 text-sm font-bold text-wine-deep uppercase tracking-wider">{label}</div>
      <div className="text-xs text-wine-muted mt-1">{sub}</div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="font-mono text-3xl md:text-4xl text-wine font-bold">→</div>
  );
}

function Scene6() {
  const items = [
    "The Abstraction Ladder Protocol.",
    "Four-phase Stage Contracts.",
    "A named cope-pattern catalog.",
    "A refusal list with teeth.",
  ];

  return (
    <div className="text-center max-w-3xl mx-auto stagger">
      <div className="size-small font-mono font-bold text-wine-muted mb-8 uppercase" style={{ animationDelay: "0ms" }}>
        Built on.
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={item}
            className="size-medium font-mono font-bold text-wine-deep text-left flex items-center gap-4"
            style={{ animationDelay: `${500 + i * 700}ms` }}
          >
            <span className="text-wine">{String(i + 1).padStart(2, "0")}.</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Scene7() {
  return (
    <div className="text-center max-w-4xl mx-auto stagger">
      <div className="space-y-2 mb-10">
        <div className="size-mega font-mono font-bold text-wine" style={{ animationDelay: "0ms" }}>
          Drill.
        </div>
        <div className="size-mega font-mono font-bold text-wine" style={{ animationDelay: "500ms" }}>
          Name.
        </div>
        <div className="size-mega font-mono font-bold text-wine" style={{ animationDelay: "1000ms" }}>
          Hold.
        </div>
      </div>

      <div className="font-mono text-sm md:text-base text-wine-muted mb-6 uppercase tracking-wider" style={{ animationDelay: "1700ms" }}>
        rate-hike-coach.vercel.app/coach
      </div>

      <a href="/coach" className="cta-btn" style={{ animationDelay: "2400ms" }}>
        Open the coach →
      </a>
    </div>
  );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-500 ${
            i === current
              ? "w-8 bg-wine dot-active"
              : i < current
                ? "w-2 bg-wine-muted"
                : "w-2 bg-cream-dusty"
          }`}
        />
      ))}
    </div>
  );
}

function DoneOverlay({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="absolute inset-0 bg-cream/95 flex items-center justify-center z-30 scene-fade-up">
      <div className="text-center stagger">
        <div className="size-small font-mono font-bold text-wine-muted mb-4 uppercase" style={{ animationDelay: "0ms" }}>
          End of demo.
        </div>
        <div className="size-large font-mono font-bold text-wine mb-8" style={{ animationDelay: "300ms" }}>
          Folder. App. Same coach.
        </div>
        <div className="flex items-center justify-center gap-4 flex-wrap" style={{ animationDelay: "800ms" }}>
          <a href="/coach" className="cta-btn">Open the coach →</a>
          <button onClick={onReplay} className="cta-btn" style={{ background: "#FEFBF6", color: "#5D3136", boxShadow: "5px 5px 0px 0px #5D3136", borderColor: "#5D3136" }}>
            ↻ Replay
          </button>
        </div>
        <div className="mt-10 font-mono text-xs text-wine-muted uppercase tracking-wider" style={{ animationDelay: "1300ms" }}>
          <a href="https://github.com/griffainai/rate-hike-coach" className="hover:text-wine underline-offset-2 hover:underline">
            github.com/griffainai/rate-hike-coach
          </a>
        </div>
      </div>
    </div>
  );
}
