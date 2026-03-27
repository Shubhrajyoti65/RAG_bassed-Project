import { useEffect, useState } from "react";

const ESTIMATED_SECONDS = 45;

function formatSeconds(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60).toString().padStart(2, "0");
  const seconds = (safe % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function LoadingSpinner() {
  const [remainingSeconds, setRemainingSeconds] = useState(ESTIMATED_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-light-card dark:bg-dark-card rounded-2xl shadow-sm border border-light-border dark:border-dark-border p-8 flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-primary/20 dark:border-primary-dark/20" />
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-primary dark:border-primary-dark border-t-transparent animate-spin" />
      </div>
      <div className="text-center">
        <p className="font-headline text-light-text dark:text-dark-text font-semibold">Analyzing your case...</p>
        <p className="font-body text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">Searching similar High Court judgments and generating analysis</p>
        <p className="font-label text-xs font-semibold text-primary dark:text-primary-dark mt-3">Estimated time left: {formatSeconds(remainingSeconds)}</p>
        <p className="font-body text-xs text-light-text-muted dark:text-dark-text-muted mt-1">
          {remainingSeconds === 0 ? "Still working. Complex queries may take a little longer." : "Please wait while we complete retrieval and drafting."}
        </p>
      </div>
    </div>
  );
}
