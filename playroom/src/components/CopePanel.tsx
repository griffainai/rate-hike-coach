"use client";

import { DetectedPattern } from "@/lib/cope-detector";

export function CopePanel({
  detected,
}: {
  detected: DetectedPattern[];
}) {
  return (
    <div className="panel p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-wine font-mono font-bold mb-3">
        COPE DETECTED.
      </div>
      {detected.length === 0 ? (
        <div className="text-sm text-wine-muted font-mono">
          None yet. The coach is listening.
        </div>
      ) : (
        <div className="space-y-2">
          {detected.map((p) => (
            <div
              key={p.id}
              className="card p-3 cope-flash"
              style={{ borderLeftWidth: '6px', borderLeftColor: '#A14A38' }}
            >
              <div className="flex items-start gap-2">
                <span className="text-accent-warn text-sm flex-shrink-0 font-bold">⚠</span>
                <div className="flex-1">
                  <div className="text-sm font-mono font-bold text-wine-deep">
                    "{p.name}"
                  </div>
                  <div className="text-xs text-wine-muted mt-1 leading-snug">
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
