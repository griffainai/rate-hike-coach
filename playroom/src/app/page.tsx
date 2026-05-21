import { ChatInterface } from "@/components/ChatInterface";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-bg-border px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🥊</div>
          <div>
            <div className="text-xs uppercase tracking-wider text-accent-coach/50">
              The Rehearsal Room
            </div>
            <div className="text-base font-medium">
              Rate Hike Coach
            </div>
          </div>
        </div>
        <div className="text-xs text-accent-coach/50 text-right">
          <div>For solo consultants raising rates with long-term clients.</div>
          <div className="text-accent-coach/40">
            The coach plays the client. You drill the conversation.
          </div>
        </div>
      </header>
      <div className="flex-1 p-4">
        <ChatInterface />
      </div>
      <footer className="border-t border-bg-border px-5 py-2 text-xs text-accent-coach/40 flex items-center justify-between">
        <div>
          Built on{" "}
          <a
            href="https://github.com/anthropics/skills"
            className="text-accent-coach/60 hover:text-accent-coach underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            ICM
          </a>
          . Folder is the architecture. UI is a viewer.
        </div>
        <div>
          See <code>identity.md</code> + <code>rules.md</code> for what the coach actually is.
        </div>
      </footer>
    </main>
  );
}
