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
      <div className="text-xs uppercase tracking-[0.18em] text-accent-coach/50 mb-2 font-medium">
        TIMER.
      </div>
      <div
        className={`text-2xl font-mono ${
          overLimit
            ? "text-accent-warn"
            : warning
              ? "text-accent-drill"
              : "text-accent-coach"
        }`}
      >
        {minutes.toString().padStart(2, "0")}:
        {secs.toString().padStart(2, "0")}
        <span className="text-accent-coach/30 text-sm">
          {" "}
          / 30:00
        </span>
      </div>
      {overLimit && (
        <div className="text-xs text-accent-warn mt-2">
          Session over time. The coach will hold the cap.
        </div>
      )}
    </div>
  );
}
