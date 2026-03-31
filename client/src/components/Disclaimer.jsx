// Component that displays a legal disclaimer regarding the nature of the AI analysis
export default function Disclaimer() {
  return (
    <div className="rounded-xl px-5 py-3 border border-amber-300/60 bg-amber-50/70 dark:bg-amber-500/8 dark:border-amber-400/30">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-amber-600 dark:text-amber-300 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <p className="font-body text-sm text-amber-900 dark:text-amber-200">
          <strong className="font-headline">Disclaimer:</strong> Nyaay Sahayak is a research tool for informational and educational purposes only. It does <strong>not</strong> provide legal advice. Please consult a qualified advocate for legal guidance.
        </p>
      </div>
    </div>
  );
}


