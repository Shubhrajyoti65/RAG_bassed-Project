import { Link } from "react-router-dom";

// Static page component providing contact information and support details
export default function ContactUsPage({ user }) {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <section className="app-card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-label text-xs font-bold tracking-[0.22em] uppercase text-primary">Support</p>
            <h1 className="mt-2 font-headline text-3xl sm:text-4xl font-bold text-text-primary">Contact Us</h1>
            <p className="font-body text-text-secondary mt-2">Need help with analysis, profile updates, or platform issues? Reach us during support hours.</p>
          </div>

          {user && (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="app-button-secondary ui-button-enhance px-4 py-2.5 font-label text-sm font-semibold">Profile</Link>
              <Link to="/contact-us" className="app-button-primary ui-button-enhance ui-button-shine px-4 py-2.5 font-label text-sm font-semibold">Contact Us</Link>
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-5">
        <aside className="app-card p-6 sm:p-8">
          <h2 className="font-headline text-xl font-bold text-text-primary">Support Details</h2>
          <div className="mt-4 space-y-3 text-sm text-text-secondary font-body">
            <p><strong className="text-text-primary">Email:</strong> support@nyaaysahayak.in</p>
            <p><strong className="text-text-primary">Phone:</strong> +91-00000-00000</p>
            <p><strong className="text-text-primary">Support Timings:</strong> Monday to Friday, 9:00 AM to 6:00 PM IST</p>
            <p><strong className="text-text-primary">Address:</strong> MNNIT Allahabad, Prayagraj, Uttar Pradesh, India</p>
            <p><strong className="text-text-primary">Response Window:</strong> Within 24 business hours</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
