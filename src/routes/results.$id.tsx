import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getResult, startOrResumeTest } from "@/lib/test-api";
import { classifyScore } from "@/lib/scoring";
import { isUnauthorized } from "@/lib/utils";
import { PageShell } from "@/components/page-shell";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorMessage, LoadingState } from "@/components/loading-state";

export const Route = createFileRoute("/results/$id")({ component: ResultPage });

function ResultPage() {
  return (
    <PageShell>
      <RequireAuth>
        <ResultInner />
      </RequireAuth>
    </PageShell>
  );
}

function ResultInner() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getResult({ data: { testId: id } })
      .then((data) => {
        if (cancelled) return;
        setScore(data.score);
      })
      .catch((err) => {
        if (cancelled) return;
        if (isUnauthorized(err)) {
          setError("Your session has expired. Please sign in again.");
          return;
        }
        if (err instanceof Error && err.message === "LOCKED") {
          void navigate({ to: "/test/complete", search: { testId: id } });
          return;
        }
        setError("This result is unavailable.");
      });
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  async function another() {
    setStarting(true);
    try {
      await startOrResumeTest();
      await navigate({ to: "/test" });
    } catch {
      setError("We couldn't start a new test. Please try again.");
    } finally {
      setStarting(false);
    }
  }

  if (error && score == null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (score == null) {
    return <LoadingState label="Loading your result…" />;
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <Card className="rounded-xl p-8 text-center sm:p-12">
        <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
          Your IQ score
        </p>
        <p className="mt-6 font-display text-7xl font-semibold tabular-nums tracking-tight">
          {score}
        </p>
        <p className="mt-3 text-lg text-fg-muted">{classifyScore(score)}</p>
        <p className="mt-8 text-sm text-fg">Thank you for completing the IQ Test.</p>
        <p className="mt-4 text-xs leading-relaxed text-fg-subtle">
          This score is generated using the scoring system of this online assessment
          and is not a clinically validated IQ measurement.
        </p>
        <div className="mt-8 flex flex-col gap-2">
          <Button type="button" disabled={starting} onClick={() => void another()}>
            {starting ? "Starting…" : "Take Another Test"}
          </Button>
          <Button asChild variant="secondary">
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
