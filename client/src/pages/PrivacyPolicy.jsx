import { Link } from "react-router-dom";

const policySections = [
  {
    title: "1. Information We Collect",
    points: [
      "Account details such as your name, email address, and encrypted authentication credentials.",
      "Case text and uploaded documents that you submit for analysis.",
      "Usage and technical metadata such as timestamps, request logs, and browser diagnostics for reliability and security.",
    ],
  },
  {
    title: "2. How We Use Information",
    points: [
      "To provide legal research support, generate case analysis outputs, and surface relevant precedent suggestions.",
      "To maintain account access, session continuity, and analysis history.",
      "To improve quality, prevent misuse, and monitor service stability.",
    ],
  },
  {
    title: "3. Data Storage and Security",
    points: [
      "Data is stored on secured infrastructure with access controls and authentication checks.",
      "We apply reasonable technical and organizational safeguards to protect submitted content.",
      "No system can be guaranteed 100% secure, but we continuously monitor and improve protections.",
    ],
  },
  {
    title: "4. Sharing and Disclosure",
    points: [
      "We do not sell your personal data.",
      "Data may be shared with trusted infrastructure or AI service providers solely to operate analysis features.",
      "Information may be disclosed when required by law or to protect legal rights and service integrity.",
    ],
  },
  {
    title: "5. Retention and Deletion",
    points: [
      "Analysis records are retained to support your history and ongoing use of the platform.",
      "You may request deletion of account-linked data, subject to legal and operational retention obligations.",
    ],
  },
  {
    title: "6. Your Responsibilities",
    points: [
      "Do not upload highly sensitive personal data unless necessary for your matter.",
      "Ensure you have authority to submit documents and case details you provide.",
      "Use outputs as informational support and consult a qualified legal professional for legal advice.",
    ],
  },
  {
    title: "7. Contact",
    points: [
      "For privacy-related requests, please contact the service administrator through your project support channel.",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-3xl p-6 sm:p-8 md:p-10">
        <div className="mb-8">
          <p className="font-label text-xs font-bold tracking-[0.24em] uppercase text-primary dark:text-primary-dark mb-3">
            Legal
          </p>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-light-text dark:text-dark-text">
            Privacy Policy
          </h1>
          <p className="font-body text-sm text-light-text-muted dark:text-dark-text-muted mt-3">
            Effective date: March 27, 2026
          </p>
          <p className="font-body text-light-text-secondary dark:text-dark-text-secondary mt-4 leading-relaxed">
            This policy explains how Nyaay Sahayak collects, uses, and protects information when you use this platform.
          </p>
        </div>

        <div className="space-y-8">
          {policySections.map((section) => (
            <section key={section.title}>
              <h2 className="font-headline text-xl font-bold text-light-text dark:text-dark-text mb-3">
                {section.title}
              </h2>
              <ul className="space-y-2.5">
                {section.points.map((point) => (
                  <li
                    key={point}
                    className="font-body text-light-text-secondary dark:text-dark-text-secondary leading-relaxed"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-light-border dark:border-dark-border flex flex-wrap items-center gap-4">
          <Link
            to="/"
            className="font-label text-sm font-semibold text-primary dark:text-primary-dark hover:underline"
          >
            Back to Home
          </Link>
          <Link
            to="/terms-of-service"
            className="font-label text-sm font-semibold text-primary dark:text-primary-dark hover:underline"
          >
            View Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}