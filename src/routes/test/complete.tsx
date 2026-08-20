import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getPaywall, startCheckout } from "@/lib/test-api";
import { isUnauthorized } from "@/lib/utils";
import { PageShell } from "@/components/page-shell";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorMessage, LoadingState } from "@/components/loading-state";

type Search = { testId?: string };

export const Route = createFileRoute("/test/complete")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    testId: typeof search.testId === "string" ? search.testId : undefined,
  }),
  component: CompletePage,
});

function CompletePage() {
  return (
    <PageShell>
      <RequireAuth>
        <CompleteInner />
      </RequireAuth>
    </PageShell>
  );
}

function CompleteInner() {
  const { testId } = Route.useSearch();
  const navigate = useNavigate();
  const [priceLabel, setPriceLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!testId) {
      setError("We couldn't find this test.");
      return;
    }
    let cancelled = false;
    getPaywall({ data: { testId } })
      .then((data) => {
        if (cancelled) return;
        if (data.paid) {
          void navigate({ to: "/results/$id", params: { id: data.testId } });
          return;
        }
        setPriceLabel(data.priceLabel);
      })
      .catch((err) => {
        if (cancelled) return;
        if (isUnauthorized(err)) {
          setError("Your session has expired. Please sign in again.");
          return;
        }
        setError(err instanceof Error ? err.message : "Could not load your result.");
      });
    return () => {
      cancelled = true;
    };
  }, [testId, navigate]);

  async function unlock() {
    if (!testId) return;
    setPending(true);
    setError(null);
    try {
      const result = await startCheckout({ data: { testId } });
      if (result.url.startsWith("http")) {
        window.location.href = result.url;
        return;
      }
      await navigate({ to: result.url });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Payment could not be completed. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }

  if (error && !priceLabel) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!priceLabel) {
    return <LoadingState label="Preparing your result…" />;
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <Card className="rounded-xl p-8 text-center">
        <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
          Assessment complete
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold">Your test is complete.</h1>
        <p className="mt-3 text-fg-muted">Your IQ score has been calculated.</p>
        <p className="mt-2 text-fg-muted">Unlock your result to discover your score.</p>

        {error && (
          <div className="mt-6 text-left">
            <ErrorMessage title="Payment could not be completed. Please try again." message={error} />
          </div>
        )}

        <Button
          type="button"
          size="lg"
          className="mt-8 w-full"
          disabled={pending}
          onClick={() => void unlock()}
        >
          {pending ? "Processing payment…" : `Unlock My IQ Score — ${priceLabel}`}
        </Button>
        <p className="mt-3 text-xs text-fg-subtle">One-time payment. Not a subscription.</p>
        <p className="mt-6 text-xs leading-relaxed text-fg-subtle">
          This online assessment is intended for entertainment and informational
          purposes and is not a clinically validated intelligence test.
        </p>
      </Card>
      <p className="mt-6 text-center text-sm">
        <Link to="/dashboard" className="text-fg-muted hover:text-fg">
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}
