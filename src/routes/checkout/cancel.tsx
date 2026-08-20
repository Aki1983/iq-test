import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Search = { testId?: string };

export const Route = createFileRoute("/checkout/cancel")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    testId: typeof search.testId === "string" ? search.testId : undefined,
  }),
  component: CancelPage,
});

function CancelPage() {
  const { testId } = Route.useSearch();
  return (
    <PageShell>
      <RequireAuth>
        <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
          <Card className="rounded-xl p-8 text-center">
            <h1 className="font-display text-3xl font-semibold">Checkout cancelled</h1>
            <p className="mt-3 text-fg-muted">
              Payment could not be completed. Please try again. Your result remains locked
              until the one-time payment is confirmed.
            </p>
            <div className="mt-8 flex flex-col gap-2">
              {testId && (
                <Button asChild>
                  <Link to="/test/complete" search={{ testId }}>
                    Return to unlock
                  </Link>
                </Button>
              )}
              <Button asChild variant="secondary">
                <Link to="/dashboard">Back to dashboard</Link>
              </Button>
            </div>
          </Card>
        </div>
      </RequireAuth>
    </PageShell>
  );
}
