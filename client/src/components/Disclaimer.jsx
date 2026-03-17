export default function Disclaimer() {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 dark:border-amber-600 px-4 py-3 rounded-r-lg">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-amber-500 dark:text-amber-400 mt-0.5 shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Disclaimer:</strong> NyayaSahayak is an AI-powered research
          tool for informational and educational purposes only. It does{" "}
          <strong>not</strong> provide legal advice. Please consult a qualified
          advocate for legal guidance.
        </p>
      </div>
    </div>
  );
}
