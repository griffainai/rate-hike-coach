import Link from "next/link";
import { ChatInterface } from "@/components/ChatInterface";
import { MODES } from "@/lib/modes";

export const metadata = {
  title: "Halftime | The Rate Hike Coach",
  description: "Mid-rehearsal reset. Coach names the meta-pattern. Adjusts the angle. Re-enters drill.",
};

const meta = MODES["halftime"];

export default function HalftimePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b-3 px-6 py-4 flex items-center justify-between" style={{ background: meta.accentHex, borderColor: meta.shadowHex, color: "#FEFBF6" }}>
        <div className="flex items-center gap-4">
          <Link href="/coach" className="text-cream/70 hover:text-cream text-xs font-mono uppercase tracking-wider transition-colors">
            ← Pick a different mode
          </Link>
          <div className="border-l-2 border-cream/30 pl-4 flex items-center gap-3">
            <span className="text-2xl">{meta.emoji}</span>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-cream/60 font-mono font-medium">
                Mode: Halftime
              </div>
              <div className="text-2xl font-mono font-bold tracking-display">
                {meta.subtitle}
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs text-cream/70 text-right hidden md:block font-mono">
          <div className="font-medium text-cream/90 uppercase tracking-wider">
            {meta.when}
          </div>
          <div className="text-cream/60 mt-1">
            Reset. Re-Drill. Commit.
          </div>
        </div>
      </header>
      <div className="flex-1 p-4 md:p-6 bg-cream">
        <ChatInterface mode="halftime" />
      </div>
    </main>
  );
}
