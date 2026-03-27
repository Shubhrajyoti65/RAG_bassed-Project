function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString();
}

export default function HistoryPanel({ history, onSelect }) {
  return (
    <div className="bg-light-card dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline text-base font-semibold text-light-text dark:text-dark-text">Saved Analysis History</h3>
        <span className="font-label text-xs text-light-text-muted dark:text-dark-text-muted">{history.length} records</span>
      </div>

      {history.length === 0 ? (
        <p className="font-body text-sm text-light-text-secondary dark:text-dark-text-secondary">No history yet. Run an analysis to save your first record.</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-auto pr-1">
          {history.map((item) => (
            <button key={item.id} type="button" onClick={() => onSelect(item)}
              className="w-full text-left border border-light-border dark:border-dark-border rounded-xl px-3 py-3 hover:bg-primary/5 dark:hover:bg-primary-dark/5 transition-colors duration-200">
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="font-label text-xs font-medium uppercase tracking-wide text-primary dark:text-primary-dark">{item.inputType}</span>
                <span className="font-label text-xs text-light-text-muted dark:text-dark-text-muted">{formatDate(item.createdAt)}</span>
              </div>
              <p className="font-body text-sm text-light-text-secondary dark:text-dark-text-secondary">{item.inputPreview}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
