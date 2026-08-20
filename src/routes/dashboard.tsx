import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getDashboard, type DashboardTest } from "@/lib/test-api";
import { isUnauthorized, formatDate } from "@/lib/utils";
import { PageShell } from "@/components/page-shell";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorMessage, LoadingState } from "@/components/loading-state";

export const Route = createFileRoute("/dashboard")({ component: DashboardPage });

function DashboardPage() {
  return (
    <PageShell>
      <RequireAuth>
        <DashboardInner />
      </RequireAuth>
    </PageShell>
  );
}

function DashboardInner() {
  const { user } = useCurrentUserState();
  const [tests, setTests] = useState<DashboardTest[] | null>(null);
  const [inProgress, setInProgress] = useState<DashboardTest | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDashboard()
      .then((data) => {
        if (cancelled) return;
        setTests(data.tests);
        setInProgress(data.inProgress);
      })
      .catch((err) => {
        if (cancelled) return;
        if (isUnauthorized(err)) {
          setError("Your session has expired. Please sign in again.");
          return;
        }
        setError("We couldn't load your dashboard. Please refresh and try again.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const name = user?.displayName ?? user?.primaryEmail ?? "there";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm text-fg-muted">Welcome back.</p>
      <h1 className="mt-1 font-display text-4xl font-semibold">{name}</h1>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Button asChild size="lg" className="h-auto min-h-12 py-3">
          <Link to="/test">{inProgress ? "Continue test" : "Take IQ Test"}</Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link to="/account">Account</Link>
        </Button>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">Previous results</h2>
        {error && (
          <div className="mt-4">
            <ErrorMessage message={error} />
          </div>
        )}
        {!tests && !error && <LoadingState label="Loading your results…" className="min-h-32" />}
        {tests && tests.filter((t) => t.status === "completed").length === 0 && (
          <p className="mt-4 text-sm text-fg-muted">
            You have no completed tests yet. Take the assessment to see your first result here.
          </p>
        )}
        {tests && tests.filter((t) => t.status === "completed").length > 0 && (
          <ul className="mt-4 space-y-3">
            {tests
              .filter((t) => t.status === "completed")
              .map((t) => (
                <li key={t.id}>
                  <Card className="flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-fg-muted">{formatDate(t.completedAt ?? t.createdAt)}</p>
                      <p className="mt-0.5 font-medium">
                        {t.paid && t.score != null ? (
                          <>
                            IQ-style score{" "}
                            <span className="tabular-nums">{t.score}</span>
                          </>
                        ) : (
                          "Result Locked"
                        )}
                      </p>
                    </div>
                    {t.paid ? (
                      <Button asChild size="sm">
                        <Link to="/results/$id" params={{ id: t.id }}>
                          View Result
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild variant="secondary" size="sm">
                        <Link to="/test/complete" search={{ testId: t.id }}>
                          Unlock result
                        </Link>
                      </Button>
                    )}
                  </Card>
                </li>
              ))}
          </ul>
        )}
      </section>

      <div className="mt-10">
        <Button type="button" variant="ghost" onClick={() => void signOut("/")}>
          Log out
        </Button>
      </div>
    </div>
  );
}
