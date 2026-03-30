import { useEffect, useState } from "react";

const STEPS = [
  { icon: "📄", label: "Reading your submission...",          detail: "Extracting text and key facts from your input." },
  { icon: "🔍", label: "Searching legal database...",         detail: "Running semantic search across High Court precedents." },
  { icon: "⚖️",  label: "Matching provisions...",             detail: "Identifying applicable Acts and Sections." },
  { icon: "🤖", label: "Consulting AI model...",              detail: "Sending context to Gemini for legal synthesis." },
  { icon: "📝", label: "Summarizing findings...",             detail: "Compiling structured case summary and insights." },
  { icon: "✅", label: "Finalizing your breakdown...",        detail: "Almost done — preparing your legal analysis." },
];

// Each step holds for ~3s before advancing
const STEP_DURATION_MS = 3000;

export default function AnalyzingLoader() {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true); // for fade transition

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
        setVisible(true);
      }, 250); // brief fade-out before switching text
    }, STEP_DURATION_MS);

    return () => clearInterval(interval);
  }, []);

  const step = STEPS[currentStep];
  const progress = Math.round(((currentStep + 1) / STEPS.length) * 100);

  return (
    <div className="app-card ui-border-highlight animate-popIn p-6 max-w-3xl mx-auto">
      {/* Spinner + icon */}
      <div className="flex items-center justify-center mb-5">
        <div className="relative w-16 h-16">
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/15 border-t-primary animate-spin" />
          {/* Emoji icon in center */}
          <div className="absolute inset-0 flex items-center justify-center text-2xl select-none">
            {step.icon}
          </div>
        </div>
      </div>

      {/* Step text */}
      <div
        className="text-center transition-opacity duration-250"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <p className="font-headline text-base font-semibold text-text-primary">
          {step.label}
        </p>
        <p className="font-body text-xs text-text-secondary mt-1 max-w-xs mx-auto leading-relaxed">
          {step.detail}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-5 px-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-label text-[10px] uppercase tracking-widest text-text-secondary">
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <span className="font-label text-[10px] font-bold text-primary">{progress}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step dots */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`rounded-full transition-all duration-500 ${
              i < currentStep
                ? "w-2 h-2 bg-primary/60"
                : i === currentStep
                ? "w-3 h-2 bg-primary"
                : "w-2 h-2 bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
