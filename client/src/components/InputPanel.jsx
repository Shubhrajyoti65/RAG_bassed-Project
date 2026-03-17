import { useState, useRef } from "react";

export default function InputPanel({ onAnalyze, loading }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (file) {
      onAnalyze({ file });
    } else if (text.trim()) {
      onAnalyze({ text: text.trim() });
    }
  }

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
    } else if (selected) {
      alert("Please select a PDF file.");
      e.target.value = "";
    }
  }

  function removeFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const canSubmit = !loading && (text.trim().length >= 50 || file);
  const charCount = text.trim().length;

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 border border-gray-100 dark:border-slate-800">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Case Description
      </h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe the domestic violence case details here. Include facts such as the nature of violence, parties involved, timeline of events, and any legal actions taken..."
        className="w-full h-48 px-4 py-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y text-sm text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 transition-colors"
        disabled={loading || !!file}
      />

      <div className="flex items-center justify-between mt-2 mb-4">
        <span className={`text-xs ${charCount >= 50 ? "text-green-600" : "text-gray-400"}`}>
          {charCount} / 50 min characters
        </span>
        {!file && charCount > 0 && charCount < 50 && (
          <span className="text-xs text-orange-500">
            Need {50 - charCount} more characters
          </span>
        )}
      </div>

      <div className="border-t border-gray-100 dark:border-slate-800 pt-4">
        <p className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-2">
          Or upload a PDF document:
        </p>
        {file ? (
          <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-950/40 px-4 py-3 rounded-lg">
            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-indigo-800 dark:text-indigo-200 flex-1 truncate">{file.name}</span>
            <button
              type="button"
              onClick={removeFile}
              className="text-indigo-600 hover:text-red-500 transition-colors"
              disabled={loading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors">
            <svg className="w-5 h-5 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm text-gray-500 dark:text-slate-400">Click to upload PDF</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
          </label>
        )}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-6 w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing Case...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Analyze Case
          </>
        )}
      </button>
    </form>
  );
}
