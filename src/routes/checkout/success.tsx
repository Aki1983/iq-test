import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { confirmCheckoutSession } from "@/lib/test-api";
import { isUnauthorized } from "@/lib/utils";
import { PageShell } from "@/components/page-shell";
import { RequireAuth } from "@/components/require-auth";
import { ErrorMessage, LoadingState } from "@/components/loading-state";

type Search = { session_id?: string };

export const Route = createFileRoute("/checkout/success")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <PageShell>
      <RequireAuth>
        <SuccessInner />
      </RequireAuth>
    </PageShell>
  );
}

function SuccessInner() {
  const { session_id: sessionId } = Route.useSearch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Payment could not be completed. Please try again.");
      return;
    }
    let cancelled = false;
    confirmCheckoutSession({ data: { sessionId } })
      .then((result) => {
        if (cancelled) return;
        if (result.ok && result.testId) {
          void navigate({ to: "/results/$id", params: { id: result.testId } });
          return;
        }
        setError("Payment could not be completed. Please try again.");
      })
      .catch((err) => {
        if (cancelled) return;
        if (isUnauthorized(err)) {
          setError("Your session has expired. Please sign in again.");
          return;
        }
        setError("Payment could not be completed. Please try again.");
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId, navigate]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <ErrorMessage title="Payment could not be completed. Please try again." message={error} />
      </div>
    );
  }

  return <LoadingState label="Processing payment…" />;
}
