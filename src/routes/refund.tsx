import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/refund")({ component: RefundPage });

function RefundPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl font-semibold">Refund Policy</h1>
        <p className="mt-2 text-sm text-fg-subtle">Placeholder — customize before launch.</p>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-fg-muted">
          <p>
            Unlocking your IQ-style score is a one-time digital purchase. Because
            the result is delivered immediately after payment is confirmed,
            refunds are generally not issued once a score has been viewed.
          </p>
          <p>
            If payment was taken in error, or you were charged without receiving
            access to your result, contact support with your account email and
            we will review the charge.
          </p>
        </div>
      </article>
    </PageShell>
  );
}
