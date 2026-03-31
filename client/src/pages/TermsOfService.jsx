import { Link } from "react-router-dom";

const termsSections = [
  {
    title: "1. Service Scope",
    points: [
      "Nyaay Sahayak provides AI-assisted legal research support for informational and educational use.",
      "The service does not create an advocate-client relationship and does not provide legal advice.",
    ],
  },
  {
    title: "2. Account and Access",
    points: [
      "You are responsible for maintaining the confidentiality of your login credentials.",
      "You must provide accurate information during registration and keep it reasonably current.",
      "You are responsible for all activity conducted through your account.",
    ],
  },
  {
    title: "3. Acceptable Use",
    points: [
      "Do not use the platform for unlawful, abusive, or harmful activity.",
      "Do not attempt to reverse engineer, disrupt, overload, or compromise platform security.",
      "Do not upload content you do not have rights or authority to share.",
    ],
  },
  {
    title: "4. AI Output and Limitations",
    points: [
      "AI-generated analysis may contain errors, omissions, or incomplete interpretations.",
      "You must independently verify material facts, citations, and legal applicability before relying on outputs.",
      "You agree to seek qualified legal counsel for case strategy, legal opinions, and formal advice.",
    ],
  },
  {
    title: "5. Intellectual Property",
    points: [
      "The platform design, software, and branding remain the property of the service owner.",
      "You retain rights in the content you upload, subject to a limited operational license needed to process your requests.",
    ],
  },
  {
    title: "6. Availability and Changes",
    points: [
      "Features may be modified, suspended, or updated to improve quality, security, or compliance.",
      "Service availability is provided on a best-effort basis and may be interrupted for maintenance or unforeseen issues.",
    ],
  },
  {
    title: "7. Limitation of Liability",
    points: [
      "To the maximum extent permitted by law, the service is provided on an \"as is\" and \"as available\" basis.",
      "The service owner is not liable for indirect, incidental, consequential, or reliance-based losses arising from use of the platform.",
    ],
  },
  {
    title: "8. Termination",
    points: [
      "Access may be suspended or terminated for violations of these terms or misuse of the service.",
      "You may discontinue use at any time.",
    ],
  },
  {
    title: "9. Governing Principles",
    points: [
      "These terms are interpreted in accordance with applicable law and good-faith platform usage standards.",
      "If one provision is unenforceable, the remaining provisions remain in effect.",
    ],
  },
];

// Page component displaying the legal terms of service for platform usage
export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="p-6 sm:p-8 md:p-10">
        <div className="mb-8">
          <p className="font-label text-xs font-bold tracking-[0.24em] uppercase text-primary mb-3">
            Legal
          </p>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-text-primary">
            Terms of Service
          </h1>
          <p className="font-body text-sm text-text-secondary mt-3">
            Effective date: March 27, 2026
          </p>
          <p className="font-body text-text-secondary mt-4 leading-relaxed">
            These terms govern access to and use of Nyaay Sahayak. By using this platform, you agree to these terms.
          </p>
        </div>

        <div className="space-y-8">
          {termsSections.map((section, index) => (
            <section
              key={section.title}
              className="animate-popIn pb-6 border-b border-border/60 last:pb-0 last:border-b-0"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <h2 className="font-headline text-xl font-bold text-text-primary mb-3">
                {section.title}
              </h2>
              <div className="mt-4 grid gap-3">
                {section.points.map((point, pointIndex) => (
                  <article
                    key={`${section.title}-${pointIndex}`}
                    className="ui-panel-box ui-border-highlight rounded-xl px-4 py-3 animate-popIn"
                    style={{ animationDelay: `${index * 0.05 + pointIndex * 0.03}s` }}
                  >
                    <p className="font-body text-text-secondary leading-relaxed flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                      <span>{point}</span>
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center gap-4">
          <Link
            to="/"
            className="font-label text-sm font-semibold text-primary hover:underline"
          >
            Back to Home
          </Link>
          <Link
            to="/privacy-policy"
            className="font-label text-sm font-semibold text-primary hover:underline"
          >
            View Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

