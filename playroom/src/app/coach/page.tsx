import Link from "next/link";
import { MODE_ORDER, MODES } from "@/lib/modes";

export const metadata = {
  title: "Pick your moment | The Rate Hike Coach",
  description: "Pre-Game. Halftime. Timeout. Post-Game. Same coach. Four moments.",
};

export default function CoachLandingPage() {
  return (
    <main className="min-h-screen flex flex-col bg-cream text-wine-deep">
      <header className="border-b-3 border-wine bg-wine px-6 py-4 flex items-center justify-between text-cream">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-cream/70 hover:text-cream text-xs font-mono uppercase tracking-wider transition-colors">
            ← Watch demo
          </Link>
          <div className="border-l-2 border-cream/30 pl-4">
            <div className="text-xs uppercase tracking-[0.2em] text-cream/60 font-mono font-medium">
              The Rate Hike Coach
            </div>
            <div className="text-2xl font-mono font-bold tracking-display">
              Drill. Name. Hold.
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1 px-6 md:px-12 py-12 md:py-16 max-w-7xl mx-auto w-full">
        <div className="mb-10 text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-wine-muted font-mono font-bold mb-4">
            Pick your moment.
          </div>
          <h1 className="size-large font-mono font-bold text-wine mb-3">
            Where are you right now?
          </h1>
          <p className="text-base md:text-lg text-wine-deep max-w-2xl mx-auto font-sans leading-relaxed">
            The coach has four modes. Each one runs a different protocol. Pick the one that matches the moment you&apos;re in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {MODE_ORDER.map((mode) => {
            const meta = MODES[mode];
            return (
              <Link
                key={mode}
                href={`/coach/${mode}`}
                className="group panel p-6 md:p-7 transition-transform hover:-translate-y-1 hover:-translate-x-0.5 flex flex-col"
                style={{
                  borderColor: meta.borderTint,
                  boxShadow: `5px 5px 0px 0px ${meta.shadowHex}`,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl md:text-5xl">{meta.emoji}</div>
                  <div className="text-xs uppercase tracking-[0.2em] font-mono font-bold opacity-50" style={{ color: meta.accentHex }}>
                    {meta.label.toUpperCase()}.
                  </div>
                </div>

                <div
                  className="text-2xl md:text-3xl font-mono font-bold mb-2"
                  style={{ color: meta.accentHex }}
                >
                  {meta.label}.
                </div>
                <div className="text-base font-mono font-medium text-wine-deep mb-3">
                  {meta.subtitle}
                </div>
                <div className="text-xs uppercase tracking-wider text-wine-muted font-mono font-bold mb-3">
                  WHEN: {meta.when}
                </div>
                <div className="text-sm text-wine-deep font-sans leading-relaxed flex-1">
                  {meta.description}
                </div>

                <div
                  className="mt-5 inline-flex items-center gap-2 self-start text-xs uppercase tracking-[0.15em] font-mono font-bold py-2 px-3 border-3 rounded transition-colors group-hover:bg-wine group-hover:text-cream"
                  style={{
                    borderColor: meta.shadowHex,
                    color: meta.accentHex,
                  }}
                >
                  Enter {meta.label} →
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center text-xs uppercase tracking-wider text-wine-muted font-mono">
          Same coach. Same folder. Four moments.
        </div>
      </section>

      <footer className="border-t-3 border-wine bg-cream-sand px-6 py-3 text-xs flex items-center justify-between text-wine-deep">
        <div className="font-mono font-bold tracking-wider uppercase">
          Folder. App. Same coach.
        </div>
        <div className="font-mono">
          <a
            href="https://github.com/griffainai/rate-hike-coach"
            className="text-wine-deep hover:text-wine underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            github.com/griffainai/rate-hike-coach
          </a>
        </div>
      </footer>
    </main>
  );
}
