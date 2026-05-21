"use client";

import { DetectedPattern } from "@/lib/cope-detector";

export function CopePanel({
  detected,
}: {
  detected: DetectedPattern[];
}) {
  return (
    <div className="panel p-4">
      <div className="text-xs uppercase tracking-wider text-accent-coach/50 mb-3">
        Cope Patterns Detected
      </div>
      {detected.length === 0 ? (
        <div className="text-sm text-accent-coach/40 italic">
          None yet. The coach is listening.
        </div>
      ) : (
        <div className="space-y-2">
          {detected.map((p) => (
            <div
              key={p.id}
              className="card p-3 border-l-2 border-l-accent-warn cope-flash"
            >
              <div className="flex items-start gap-2">
                <span className="text-accent-warn text-sm flex-shrink-0">⚠</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-accent-coach">
                    "{p.name}"
                  </div>
                  <div className="text-xs text-accent-coach/60 mt-1 leading-snug">
                    {p.underneath}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
