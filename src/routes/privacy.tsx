import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl font-semibold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-fg-subtle">Placeholder — customize before launch.</p>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-fg-muted">
          <p>
            IQ Test collects the email address you use to register, your test
            answers, calculated scores, and payment records needed to unlock
            results.
          </p>
          <p>
            We do not sell personal data. Payment card details are processed by
            Stripe and are not stored on our servers.
          </p>
          <p>
            This assessment is for entertainment and informational purposes. We
            do not use results for diagnosis, employment, or clinical decisions.
          </p>
        </div>
      </article>
    </PageShell>
  );
}
