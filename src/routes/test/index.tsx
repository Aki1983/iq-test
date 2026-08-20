import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  completeTest,
  getActiveTest,
  saveAnswer,
  startOrResumeTest,
  type PublicTest,
} from "@/lib/test-api";
import { TEST_LENGTH } from "@/lib/question-types";
import { isUnauthorized } from "@/lib/utils";
import { PageShell } from "@/components/page-shell";
import { RequireAuth } from "@/components/require-auth";
import { QuestionCard } from "@/components/question-card";
import { ProgressBar } from "@/components/progress-bar";
import { Button } from "@/components/ui/button";
import { ErrorMessage, LoadingState } from "@/components/loading-state";

export const Route = createFileRoute("/test/")({ component: TestPage });

function TestPage() {
  return (
    <PageShell>
      <RequireAuth>
        <TestInner />
      </RequireAuth>
    </PageShell>
  );
}

function firstUnanswered(answers: Array<string | null>): number {
  const idx = answers.findIndex((a) => a == null);
  if (idx === -1) return Math.max(0, answers.length - 1);
  return idx;
}

function TestInner() {
  const navigate = useNavigate();
  const [test, setTest] = useState<PublicTest | null>(null);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const existing = await getActiveTest();
        const next = existing ?? (await startOrResumeTest());
        if (cancelled) return;
        if (next.status === "completed") {
          await navigate({ to: "/test/complete", search: { testId: next.id } });
          return;
        }
        setTest(next);
        setIndex(firstUnanswered(next.answers));
      } catch (err) {
        if (cancelled) return;
        if (isUnauthorized(err)) {
          setError("Your session has expired. Please sign in again.");
          return;
        }
        setError("We couldn't load your test. Please refresh and try again.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const persist = useCallback(
    async (testId: string, questionIndex: number, key: string | null) => {
      setSaving(true);
      try {
        await saveAnswer({ data: { testId, index: questionIndex, key } });
      } catch (err) {
        if (isUnauthorized(err)) {
          setError("Your session has expired. Please sign in again.");
          return;
        }
        setError("Your answer could not be saved. Please try again.");
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  async function select(key: string) {
    if (!test) return;
    const answers = [...test.answers];
    answers[index] = key;
    setTest({ ...test, answers });
    await persist(test.id, index, key);
  }

  async function go(delta: number) {
    if (!test) return;
    const next = Math.max(0, Math.min(test.questions.length - 1, index + delta));
    setIndex(next);
  }

  async function finish() {
    if (!test) return;
    if (test.answers.some((a) => a == null)) {
      setError("Please answer every question before finishing.");
      return;
    }
    setSaving(true);
    try {
      const result = await completeTest({ data: { testId: test.id } });
      await navigate({ to: "/test/complete", search: { testId: result.testId } });
    } catch (err) {
      if (isUnauthorized(err)) {
        setError("Your session has expired. Please sign in again.");
        return;
      }
      setError(err instanceof Error ? err.message : "Could not finish the test.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!test) return;
    const current = test;
    const questionIndex = index;
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      const question = current.questions[questionIndex];
      if (!question) return;
      if (e.key >= "1" && e.key <= "9") {
        const opt = question.options[Number(e.key) - 1];
        if (opt) void select(opt.key);
      }
      if (e.key === "ArrowLeft") void go(-1);
      if (e.key === "ArrowRight" && current.answers[questionIndex]) void go(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (error && !test) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <ErrorMessage title="Test loading failure" message={error} />
      </div>
    );
  }

  if (!test) {
    return <LoadingState label="Loading your test…" />;
  }

  const question = test.questions[index];
  if (!question) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <ErrorMessage message="We couldn't load your test. Please refresh and try again." />
      </div>
    );
  }

  const last = index === test.questions.length - 1;
  const selected = test.answers[index] ?? null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <ProgressBar current={index + 1} total={TEST_LENGTH} />
      {error && (
        <div className="mt-4">
          <ErrorMessage message={error} />
        </div>
      )}
      <div className="mt-6">
        <QuestionCard question={question} selectedKey={selected} onSelect={(key) => void select(key)} />
      </div>
      <div className="mt-6 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="secondary"
          disabled={index === 0 || saving}
          onClick={() => void go(-1)}
        >
          Previous
        </Button>
        {last ? (
          <Button type="button" disabled={saving || selected == null} onClick={() => void finish()}>
            {saving ? "Saving…" : "Finish Test"}
          </Button>
        ) : (
          <Button type="button" disabled={saving || selected == null} onClick={() => void go(1)}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
