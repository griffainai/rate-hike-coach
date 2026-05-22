import { ChatInterface } from "@/components/ChatInterface";

export default function CoachPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b-3 border-wine bg-wine px-6 py-4 flex items-center justify-between text-cream">
        <div className="flex items-center gap-4">
          <a href="/" className="text-cream/70 hover:text-cream text-xs font-mono uppercase tracking-wider transition-colors">
            ← Watch demo
          </a>
          <div className="border-l-2 border-cream/30 pl-4">
            <div className="text-xs uppercase tracking-[0.2em] text-cream/60 font-mono font-medium">
              The Rate Hike Coach
            </div>
            <div className="text-2xl font-mono font-bold tracking-display">
              Drill. Name. Hold.
            </div>
          </div>
        </div>
        <div className="text-xs text-cream/70 text-right hidden md:block font-mono">
          <div className="font-medium text-cream/90 uppercase tracking-wider">
            For solo consultants raising rates.
          </div>
          <div className="text-cream/60 mt-1">
            Coach plays the client. You hold the number.
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-6">
        <ChatInterface />
      </div>

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
          {" · "}
          <a
            href="https://eduba.io"
            className="text-wine-deep hover:text-wine underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            built on ICM
          </a>
        </div>
      </footer>
    </main>
  );
}
