import { ChatInterface } from "@/components/ChatInterface";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-bg-border px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🥊</div>
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-accent-coach/50 font-medium">
              The Rate Hike Coach
            </div>
            <div className="text-base font-medium tracking-tight">
              Drill. Name. Hold.
            </div>
          </div>
        </div>
        <div className="text-xs text-accent-coach/50 text-right">
          <div className="font-medium text-accent-coach/70">
            For solo consultants raising rates.
          </div>
          <div className="text-accent-coach/40">
            The coach plays the client. You hold the number.
          </div>
        </div>
      </header>
      <div className="flex-1 p-4">
        <ChatInterface />
      </div>
      <footer className="border-t border-bg-border px-5 py-2 text-xs text-accent-coach/40 flex items-center justify-between">
        <div className="font-medium tracking-wide">
          FOLDER. APP. SAME COACH.
        </div>
        <div>
          <a
            href="https://github.com/griffainai/rate-hike-coach"
            className="text-accent-coach/60 hover:text-accent-coach underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            github.com/griffainai/rate-hike-coach
          </a>
          {" "}·{" "}
          <a
            href="https://eduba.io"
            className="text-accent-coach/60 hover:text-accent-coach underline-offset-2 hover:underline"
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
