import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col pb-12 mt-2 animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-brand-navy dark:bg-brand-dark rounded-[2.5rem] pt-24 pb-32 px-6 lg:px-12 overflow-hidden shadow-2xl border border-brand-navy/50">
        {/* Decorative background glow */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-peach via-brand-navy to-transparent" />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-brand-peach/10 text-brand-peach text-sm font-bold tracking-widest uppercase mb-8 border border-brand-peach/20 shadow-sm backdrop-blur-md">
            Janta Ki Seva Mein Samarpit
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight leading-[1.15]">
            AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-peach to-brand-red directly">Legal Precedent</span> Analysis
          </h1>
          <p className="text-lg md:text-xl text-brand-cream/80 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Instantly contextualize domestic violence cases. Upload your case files and discover relevant High Court judgments in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-4">
            <Link
              to="/analyze"
              className="bg-brand-red hover:bg-[#aa180e] text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(146,20,12,0.5)] hover:shadow-[0_0_30px_rgba(146,20,12,0.7)] flex items-center justify-center gap-2"
            >
              Analyze Your Case
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <a
              href="#features"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-semibold text-lg transition-colors flex items-center justify-center backdrop-blur-sm"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy dark:text-slate-100 mb-5">
              Why use Nyaay Sahayak?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Built specifically to assist legal professionals and individuals in understanding complex domestic violence cases through the lens of established precedents.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-slate-800">
              <div className="w-14 h-14 bg-brand-navy/5 dark:bg-brand-navy/30 rounded-2xl flex items-center justify-center mb-6 border border-brand-navy/10 dark:border-brand-navy/40">
                <svg className="w-7 h-7 text-brand-navy dark:text-brand-peach" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">AI Case Analysis</h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                Our advanced language models parse complex legal descriptions in seconds, extracting key facts, involved parties, and judicial contexts automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-slate-800">
              <div className="w-14 h-14 bg-brand-red/10 dark:bg-brand-red/20 rounded-2xl flex items-center justify-center mb-6 border border-brand-red/20 dark:border-brand-red/30">
                <svg className="w-7 h-7 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">Document Processing</h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                Securely drag and drop your FIRs, case notes, or PDF documents. We seamlessly handle extraction and prepare the data for contextual matching.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-slate-800">
              <div className="w-14 h-14 bg-brand-peach/30 dark:bg-brand-peach/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-peach/40 dark:border-brand-peach/20">
                <svg className="w-7 h-7 text-brand-navy dark:text-brand-peach" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">Precedent Discovery</h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                Discover directly relevant High Court judgments. See match confidence scores, detailed parallels, and identical legal provisions utilized in previous cases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern CTA Bottom */}
      <section className="py-12 px-6 lg:px-8 text-center bg-gray-50 dark:bg-slate-950 rounded-[2.5rem] mt-8 mb-4 mx-2 sm:mx-8 border border-gray-200 dark:border-slate-800">
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-2xl font-black text-brand-navy dark:text-slate-100 text-left">
            Ready to find the right precedents?
          </h2>
          <Link
            to="/analyze"
            className="inline-flex shrink-0 bg-brand-navy hover:bg-[#0c1433] dark:bg-white dark:text-brand-navy dark:hover:bg-gray-100 px-8 py-3.5 rounded-2xl font-bold transition-all shadow-md items-center gap-2 text-white"
          >
            Start Analyzing Now
          </Link>
        </div>
      </section>
    </div>
  );
}
