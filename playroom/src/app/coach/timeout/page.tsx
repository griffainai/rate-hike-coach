import Link from "next/link";
import { ChatInterface } from "@/components/ChatInterface";
import { MODES } from "@/lib/modes";

export const metadata = {
  title: "TIMEOUT | The Rate Hike Coach",
  description: "60-second emergency protocol. You're on the call right now. The coach is your earpiece.",
};

const meta = MODES["timeout"];

export default function TimeoutPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: meta.bgTint }}>
      <header
        className="border-b-3 px-6 py-3 flex items-center justify-between"
        style={{ background: meta.accentHex, borderColor: meta.shadowHex, color: "#FEFBF6" }}
      >
        <div className="flex items-center gap-4">
          <Link href="/coach" className="text-cream/70 hover:text-cream text-xs font-mono uppercase tracking-wider transition-colors">
            ← Pick a different mode
          </Link>
          <div className="border-l-2 border-cream/30 pl-4 flex items-center gap-3">
            <span className="text-2xl animate-pulse">{meta.emoji}</span>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-cream/60 font-mono font-bold">
                Mode: Timeout — URGENT
              </div>
              <div className="text-2xl font-mono font-bold tracking-display">
                {meta.subtitle}
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs text-cream/80 text-right hidden md:block font-mono font-bold uppercase tracking-wider">
          <div>{meta.when}</div>
          <div className="text-cream/60 mt-1 normal-case font-normal">
            Type fast. Read faster.
          </div>
        </div>
      </header>
      <div className="flex-1 p-4 md:p-6">
        <ChatInterface mode="timeout" />
      </div>
    </main>
  );
}
