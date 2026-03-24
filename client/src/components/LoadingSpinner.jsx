import { useEffect, useState } from "react";

const ESTIMATED_SECONDS = 45;

function formatSeconds(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safe % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function LoadingSpinner() {
  const [remainingSeconds, setRemainingSeconds] = useState(ESTIMATED_SECONDS);

  useEffect(() => {
    setRemainingSeconds(ESTIMATED_SECONDS);
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isRunningLong = remainingSeconds === 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-8 border border-gray-100 dark:border-slate-800 flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-100 dark:border-indigo-900 rounded-full" />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-gray-800 dark:text-slate-100 font-semibold">Analyzing your case...</p>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Searching similar High Court judgments and generating analysis
        </p>
        <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mt-3">
          Estimated time left: {formatSeconds(remainingSeconds)}
        </p>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
          {isRunningLong
            ? "Still working. Complex queries may take a little longer."
            : "Please wait while we complete retrieval and drafting."}
        </p>
      </div>
    </div>
  );
}
