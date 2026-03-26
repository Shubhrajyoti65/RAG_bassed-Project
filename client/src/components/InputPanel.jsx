import { useState, useRef } from "react";

export default function InputPanel({ onAnalyze, loading }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
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
    processFile(selected);
  }

  function handleDragOver(e) {
    e.preventDefault();
    if (!loading && !file) setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    if (loading || file) return;
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  }

  function processFile(selected) {
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
    } else if (selected) {
      alert("Please select a valid PDF file.");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const canSubmit = !loading && (text.trim().length >= 50 || file);
  const charCount = text.trim().length;

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-slate-800">
      <h2 className="text-xl font-bold text-brand-navy dark:text-slate-100 mb-6 flex items-center gap-3">
        <div className="p-2 bg-brand-peach/20 rounded-lg text-brand-red shadow-sm border border-brand-peach/30">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        Case Description
      </h2>

      <div className="mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe the domestic violence case details here. Include facts such as the nature of violence, parties involved, timeline of events, and any legal actions taken..."
          className="w-full h-40 px-4 py-3 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 rounded-xl focus:ring-2 focus:ring-brand-peach focus:border-brand-peach text-sm text-gray-700 dark:text-slate-200 transition-colors resize-y shadow-inner"
          disabled={loading || !!file}
        />
        <div className="flex items-center justify-between mt-2 px-1">
          <span className={`text-xs font-medium ${charCount >= 50 ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
            {charCount} / 50 min characters
          </span>
          {!file && charCount > 0 && charCount < 50 && (
            <span className="text-xs font-medium text-brand-red">
              Need {50 - charCount} more characters
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 dark:border-slate-700" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-slate-900 px-3 text-xs font-medium text-gray-400 uppercase tracking-widest">
            Or upload PDF
          </span>
        </div>
      </div>

      <div className="mt-6">
        {file ? (
          <div className="flex items-center gap-4 bg-brand-navy/5 border border-brand-navy/10 dark:bg-brand-navy/20 dark:border-brand-navy/30 p-4 rounded-xl shadow-sm">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
              <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">{file.name}</p>
              <p className="text-xs text-brand-navy dark:text-brand-peach font-medium mt-1 uppercase tracking-wider">{(file.size / 1024 / 1024).toFixed(2)} MB &bull; PDF Document</p>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="p-2 text-gray-400 hover:text-brand-red hover:bg-brand-red/10 rounded-full transition-colors focus:ring-2 focus:ring-brand-red/50"
              disabled={loading}
              title="Remove file"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <label 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full h-36 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ease-in-out ${
              isDragging 
                ? "border-brand-red bg-brand-red/5 dark:bg-brand-red/10 scale-[1.02] shadow-inner" 
                : "border-gray-300 dark:border-slate-700 hover:border-brand-peach hover:bg-brand-peach/5 dark:hover:bg-brand-peach/10 bg-gray-50/50 dark:bg-slate-800/20"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            title="Click or drag and drop a PDF file here"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className={`p-3 rounded-full mb-3 ${isDragging ? "bg-brand-red/10" : "bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700"}`}>
                <svg className={`w-8 h-8 ${isDragging ? "text-brand-red" : "text-gray-400 dark:text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="mb-2 text-sm text-gray-500 dark:text-slate-400">
                <span className="font-semibold text-brand-navy dark:text-brand-peach">Click to upload</span> or drag and drop
              </p>
              <p className="text-[11px] font-medium text-gray-400 dark:text-slate-500 uppercase tracking-widest">PDF documents only (Max. 10MB)</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
              aria-label="Upload PDF document"
            />
          </label>
        )}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-8 w-full py-4 px-6 bg-brand-navy hover:bg-brand-dark text-white font-bold rounded-xl focus:ring-4 focus:ring-brand-peach/50 disabled:bg-gray-300 dark:disabled:bg-slate-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg disabled:shadow-none"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5 text-brand-peach" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing Document...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 text-brand-peach" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Analyze Case File
          </>
        )}
      </button>
    </form>
  );
}
