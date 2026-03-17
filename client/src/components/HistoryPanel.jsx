function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString();
}

export default function HistoryPanel({ history, onSelect }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800 dark:text-slate-100">Saved Analysis History</h3>
        <span className="text-xs text-gray-500 dark:text-slate-400">{history.length} records</span>
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-slate-400">No history yet. Run an analysis to save your first record.</p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-auto pr-1">
          {history.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className="w-full text-left border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-3 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-colors"
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                  {item.inputType}
                </span>
                <span className="text-xs text-gray-400 dark:text-slate-500">{formatDate(item.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-slate-300">{item.inputPreview}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
