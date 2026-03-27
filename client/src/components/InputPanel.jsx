import { useState, useRef } from "react";

export default function InputPanel({ onAnalyze, loading }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (file) onAnalyze({ file });
    else if (text.trim()) onAnalyze({ text: text.trim() });
  }

  function handleFileChange(e) { processFile(e.target.files[0]); }

  function handleDragOver(e) { e.preventDefault(); if (!loading && !file) setIsDragging(true); }
  function handleDragLeave(e) { e.preventDefault(); setIsDragging(false); }
  function handleDrop(e) { e.preventDefault(); setIsDragging(false); if (!loading && !file) processFile(e.dataTransfer.files[0]); }

  function processFile(selected) {
    if (selected && selected.type === "application/pdf") setFile(selected);
    else if (selected) alert("Please select a valid PDF file.");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile() { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }

  const canSubmit = !loading && (text.trim().length >= 50 || file);
  const charCount = text.trim().length;

  return (
    <form onSubmit={handleSubmit} className="bg-light-card dark:bg-dark-card rounded-2xl shadow-sm border border-light-border dark:border-dark-border p-6 sm:p-8">
      <h2 className="font-headline text-xl font-bold text-light-text dark:text-dark-text mb-6 flex items-center gap-3">
        <div className="p-2 gradient-primary-bg rounded-xl shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        Case Description
      </h2>

      <div className="mb-6">
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Describe the domestic violence case details here. Include facts such as the nature of violence, parties involved, timeline of events, and any legal actions taken..."
          className="w-full h-40 px-4 py-3 bg-light-muted dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none font-body text-sm text-light-text dark:text-dark-text transition-all duration-200 resize-y placeholder:text-light-text-muted/60"
          disabled={loading || !!file} />
        <div className="flex items-center justify-between mt-2 px-1">
          <span className={`font-label text-xs font-medium ${charCount >= 50 ? "text-green-600 dark:text-green-400" : "text-light-text-muted dark:text-dark-text-muted"}`}>
            {charCount} / 50 min characters
          </span>
          {!file && charCount > 0 && charCount < 50 && (
            <span className="font-label text-xs font-medium text-pink-600 dark:text-pink-400">Need {50 - charCount} more</span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-light-border dark:border-dark-border" /></div>
        <div className="relative flex justify-center">
          <span className="bg-light-card dark:bg-dark-card px-3 font-label text-xs font-semibold text-light-text-muted dark:text-dark-text-muted uppercase tracking-widest">Or upload PDF</span>
        </div>
      </div>

      {file ? (
        <div className="flex items-center gap-4 bg-primary/5 dark:bg-primary-dark/10 border border-primary/20 dark:border-primary-dark/20 p-4 rounded-xl">
          <div className="p-3 bg-light-card dark:bg-dark-card rounded-lg shadow-sm border border-light-border dark:border-dark-border">
            <svg className="w-8 h-8 text-primary dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-sm font-semibold text-light-text dark:text-dark-text truncate">{file.name}</p>
            <p className="font-label text-xs text-primary dark:text-primary-dark font-medium mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB · PDF Document</p>
          </div>
          <button type="button" onClick={removeFile} className="p-2 text-light-text-muted hover:text-red-500 rounded-full transition-colors" disabled={loading}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ) : (
        <label onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-36 px-4 py-6 rounded-xl cursor-pointer transition-all duration-200 border-2 border-dashed ${
            isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-light-border dark:border-dark-border bg-light-muted dark:bg-dark-surface hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary-dark/5"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className={`w-8 h-8 mb-3 ${isDragging ? "text-primary" : "text-light-text-muted dark:text-dark-text-muted"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="mb-2 font-body text-sm text-light-text-secondary dark:text-dark-text-secondary">
              <span className="font-semibold text-primary dark:text-primary-dark">Click to upload</span> or drag and drop
            </p>
            <p className="font-label text-[11px] text-light-text-muted dark:text-dark-text-muted uppercase tracking-widest">PDF documents only (Max. 10MB)</p>
          </div>
          <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" disabled={loading} />
        </label>
      )}

      <button type="submit" disabled={!canSubmit}
        className="mt-8 w-full py-4 px-6 gradient-primary-bg text-white font-bold font-label rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.01] disabled:scale-100 disabled:shadow-none">
        {loading ? (
          <><svg className="animate-spin w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Analyzing Document...</>
        ) : (
          <><svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>Analyze Case File</>
        )}
      </button>
    </form>
  );
}
