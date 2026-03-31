import { Link } from "react-router-dom";

const LEGAL_QUOTES = [
  {
    quote: "Justice should not only be done, but should manifestly and undoubtedly be seen to be done.",
    author: "Lord Hewart",
  },
  {
    quote: "Bail is the rule and jail is the exception.",
    author: "Justice V.R. Krishna Iyer",
  },
  {
    quote: "The Constitution is not a mere lawyers' document, it is a vehicle of life.",
    author: "Dr. B.R. Ambedkar",
  },
  {
    quote: "Law and order exist for the purpose of establishing justice.",
    author: "Martin Luther King Jr.",
  },
  {
    quote: "A judiciary must be independent if liberty is to survive.",
    author: "Felix Frankfurter",
  },
  {
    quote: "Injustice anywhere is a threat to justice everywhere.",
    author: "Martin Luther King Jr.",
  },
  {
    quote: "The life of the law has not been logic; it has been experience.",
    author: "Oliver Wendell Holmes Jr.",
  },
  {
    quote: "Equal justice under law is not merely a caption on the facade of the Supreme Court.",
    author: "Lewis F. Powell Jr.",
  },
];

// Formats a date value into a localized human-readable string
function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString();
}

// Extracts the first letter of a name to use as a fallback profile avatar
function getAvatarLabel(name) {
  return String(name || "U").trim().charAt(0).toUpperCase() || "U";
}

// Formats a raw gender string into a presentable title-cased version
function formatGender(value) {
  const safeValue = String(value || "").trim();
  if (!safeValue) {
    return "Not set";
  }

  return safeValue
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}

// Randomly selects a legal quote from a predefined list based on a seed value
function pickQuote(quoteSeed) {
  const safeSeed = Number(quoteSeed) || 0;
  const index = Math.abs(safeSeed) % LEGAL_QUOTES.length;
  return LEGAL_QUOTES[index];
}

// Main dashboard page showcasing user stats, profile summary, and recent activity
export default function Dashboard({ user, quoteSeed, history = [], onSelect }) {
  const totalCases = history.length;
  const textCases = history.filter((h) => h.inputType === "text").length;
  const pdfCases = history.filter((h) => h.inputType === "pdf").length;
  const recentHistory = history.slice(0, 12);
  const firstName = String(user?.name || "User").split(" ")[0];
  const quoteOfSession = pickQuote(quoteSeed);
  const selectedGender = user?.gender || user?.sex || "";
  const profileIncomplete = !user?.avatarUrl || !selectedGender;

  const stats = [
    { label: "Total Cases", value: totalCases },
    { label: "Text Analyses", value: textCases },
    { label: "PDF Analyses", value: pdfCases },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <section className="app-card p-6 sm:p-8">
        <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-stretch">
          <aside className="app-card p-5 sm:p-6 min-w-72 order-2 lg:order-1 h-full flex flex-col">
            <p className="font-label text-[11px] font-semibold tracking-[0.16em] uppercase text-text-secondary">Profile</p>
            <div className="mt-3 flex items-center gap-4">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name || "User avatar"}
                  className="h-16 w-16 rounded-full object-cover border border-border"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="inline-flex h-16 w-16 rounded-full items-center justify-center gradient-primary-bg text-white font-headline text-2xl">
                  {getAvatarLabel(user?.name)}
                </span>
              )}

              <div>
                <p className="font-label text-sm font-bold text-text-primary">{user?.name || "User"}</p>
                <p className="font-body text-xs text-text-secondary break-all">{user?.email || "No email"}</p>
                <p className="font-body text-xs text-text-secondary mt-1">Gender: {formatGender(selectedGender)}</p>
              </div>
            </div>

            {profileIncomplete && (
              <p className="mt-3 rounded-lg border border-amber-300/60 bg-amber-50/90 px-3 py-2 font-body text-xs text-amber-800">
                Complete your profile
              </p>
            )}

            <Link to="/profile" className="mt-auto pt-4 inline-flex text-sm font-label font-semibold text-primary hover:underline">
              Edit profile
            </Link>
          </aside>

          <div className="order-1 lg:order-2 h-full flex flex-col">
            <p className="font-label text-xs font-bold tracking-[0.22em] uppercase text-primary">Dashboard</p>
            <h1 className="mt-2 font-headline text-3xl sm:text-4xl font-bold text-text-primary">
              Welcome back, {firstName}
            </h1>

            <div className="mt-5 rounded-2xl ui-panel-box p-4 sm:p-5 flex-1">
              <blockquote className="mt-2 font-body text-text-primary text-base leading-relaxed">
                "{quoteOfSession.quote}"
              </blockquote>
              <p className="mt-2 font-label text-xs text-text-secondary">- {quoteOfSession.author}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="app-card ui-border-highlight animate-popIn p-5"
            style={{ animationDelay: `${index * 0.07}s` }}
          >
            <div className="ui-icon-enhance w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-primary/10 text-primary">
              <span className="font-headline text-xl font-bold">{stat.value}</span>
            </div>
            <p className="font-label text-xs font-semibold text-text-secondary uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {history.length === 0 ? (
        <div className="app-card flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="gradient-primary-bg p-5 rounded-2xl shadow-lg mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-headline text-xl font-bold text-text-primary mb-2">No analysis history yet</h3>
          <p className="font-body text-text-secondary max-w-sm mx-auto mb-8">
            You haven&apos;t analyzed any cases yet. Head over to the Analyze page to analyze your first domestic violence document.
          </p>
          <Link to="/analyze" className="app-button-primary ui-button-enhance ui-button-shine px-8 py-3.5 font-bold font-label shadow-md">
            Start First Analysis
          </Link>
        </div>
      ) : (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-headline text-2xl font-bold text-text-primary">Previous Cases (Top 12)</h2>
            <Link to="/history" className="font-label text-sm font-semibold text-primary hover:underline">
              View full history
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentHistory.map((item, index) => (
              <article
                key={item.id}
                className="app-card ui-border-highlight animate-popIn p-5 min-h-56 flex flex-col group cursor-pointer relative overflow-hidden"
                style={{ animationDelay: `${index * 0.06}s` }}
                onClick={() => onSelect(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    onSelect(item);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="px-2.5 py-1 bg-surface font-label text-xs font-bold uppercase tracking-wider rounded-full text-text-primary border border-border">
                    #{index + 1} {item.inputType}
                  </span>
                  <span className="font-label text-xs text-text-primary">{formatDate(item.createdAt)}</span>
                </div>

                <div className="grow mb-4 relative z-10">
                  <p className="font-body text-text-primary text-sm leading-relaxed line-clamp-3">
                    {item.inputPreview || "No preview available for this document."}
                  </p>
                </div>

                <div className="mt-auto pt-3 border-t border-border flex items-center justify-between relative z-10">
                  <span className="font-label text-xs font-bold text-primary">Open result</span>
                  <div className="ui-icon-enhance w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white text-primary transition-all duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
