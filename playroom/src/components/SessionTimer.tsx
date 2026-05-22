"use client";

import { useEffect, useState } from "react";

const SESSION_LIMIT_SECONDS = 30 * 60;

export function SessionTimer({ started }: { started: boolean }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [started]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const overLimit = seconds >= SESSION_LIMIT_SECONDS;
  const warning = seconds >= SESSION_LIMIT_SECONDS - 5 * 60;

  return (
    <div className="panel p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-wine font-mono font-bold mb-2">
        TIMER.
      </div>
      <div
        className={`text-3xl font-mono font-bold tracking-tight ${
          overLimit
            ? "text-accent-warn"
            : warning
              ? "text-accent-drill"
              : "text-wine-deep"
        }`}
      >
        {minutes.toString().padStart(2, "0")}:
        {secs.toString().padStart(2, "0")}
        <span className="text-wine-soft text-sm">
          {" "}
          / 30:00
        </span>
      </div>
      {overLimit && (
        <div className="text-xs text-accent-warn mt-2 font-mono">
          Session over time. Coach holds the cap.
        </div>
      )}
    </div>
  );
}
