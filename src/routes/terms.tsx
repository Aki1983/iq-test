import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/terms")({ component: TermsPage });

function TermsPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl font-semibold">Terms of Service</h1>
        <p className="mt-2 text-sm text-fg-subtle">Placeholder — customize before launch.</p>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-fg-muted">
          <p>
            By creating an account you agree to use IQ Test for personal,
            non-clinical purposes. The assessment is not an official IQ test, is
            not scientifically certified, and does not diagnose intelligence.
          </p>
          <p>
            Unlocking a result is a one-time purchase of €4.79 per completed
            test. It is not a subscription. Each new test requires a new unlock
            to view that test’s score.
          </p>
          <p>
            We may update these terms. Continued use after an update constitutes
            acceptance.
          </p>
        </div>
      </article>
    </PageShell>
  );
}
