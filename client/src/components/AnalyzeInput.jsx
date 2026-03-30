import { useRef, useState } from "react";

const CATEGORY_OPTIONS = [
  "Employment",
  "Property",
  "Domestic Violence",
  "Maintenance",
  "Custody",
  "Dowry",
];

export default function AnalyzeInput({ onAnalyze, loading }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Domestic Violence");
  const fileInputRef = useRef(null);

  function processFile(selected) {
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      alert("Please select a valid PDF file.");
      return;
    }
    setFile(selected);
  }

  function handleFileChange(e) {
    processFile(e.target.files?.[0]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();

    if (!file && !trimmed) {
      return;
    }

    if (file) {
      await onAnalyze({ file });
      return;
    }

    const payloadText = selectedCategory
      ? `[Category: ${selectedCategory}]\n${trimmed}`
      : trimmed;

    await onAnalyze({ text: payloadText });
  }

  const canSubmit = !loading && (Boolean(file) || Boolean(text.trim()));

  return (
    <form
      onSubmit={handleSubmit}
      className="app-card ui-border-highlight animate-popIn p-5 sm:p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="ui-icon-enhance w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 className="font-headline text-2xl font-semibold text-text-primary">Start your consultation</h2>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading || Boolean(file)}
        placeholder="Explain your situation here. Use your own words..."
        className="w-full h-40 app-input ui-border-highlight px-5 py-4 text-base sm:text-lg leading-relaxed"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORY_OPTIONS.map((option) => {
          const active = selectedCategory === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setSelectedCategory(option)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition ${
                active
                  ? "bg-primary/15 text-primary border border-primary/40"
                  : "bg-surface text-text-primary border border-border hover:text-primary ui-border-highlight"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:text-primary transition-colors ui-border-highlight ui-button-enhance"
          disabled={loading}
        >
          <svg className="ui-icon-enhance w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Attach PDF (optional)
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />

        {file && (
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-3 py-1.5 text-xs text-primary">
            <span className="max-w-45 truncate">{file.name}</span>
            <button
              type="button"
              onClick={removeFile}
              className="ui-icon-enhance text-primary hover:opacity-80"
              aria-label="Remove attached PDF"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-7 w-full app-button-primary ui-button-soft ui-button-shine font-label font-semibold text-base sm:text-lg py-4 disabled:opacity-55 disabled:cursor-not-allowed"
      >
        {loading ? "Analyzing Situation..." : "Analyze Situation"}
      </button>
    </form>
  );
}


