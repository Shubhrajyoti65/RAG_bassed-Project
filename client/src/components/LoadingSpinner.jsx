export default function LoadingSpinner() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-8 border border-gray-100 dark:border-slate-800 flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-100 dark:border-indigo-900 rounded-full" />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-gray-800 dark:text-slate-100 font-semibold">Analyzing your case...</p>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Searching similar Allahabad High Court judgments and generating analysis
        </p>
      </div>
    </div>
  );
}
