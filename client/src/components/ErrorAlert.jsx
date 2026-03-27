export default function ErrorAlert({ message, onDismiss }) {
  return (
    <div className="rounded-xl p-4 flex items-start gap-3 border border-red-300/60 bg-red-50/80 dark:bg-red-500/10 dark:border-red-400/35">
      <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
      </svg>
      <div className="flex-1">
        <p className="font-headline text-sm text-red-700 dark:text-red-300 font-semibold">Analysis Failed</p>
        <p className="font-body text-sm text-red-700/90 dark:text-red-200 mt-1">{message}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-500 hover:text-red-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  );
}


