import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { ClientQuestion, StoredQuestion } from "@/lib/question-types";
import { TEST_LENGTH } from "@/lib/question-types";
import { PRICE_CENTS, PRICE_CURRENCY, PRICE_LABEL, scoreFromCorrectCount } from "@/lib/scoring";

type TestRow = {
  id: string;
  user_id: string;
  status: string;
  paid: boolean;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  score: number | null;
  correct_count: number | null;
  questions: unknown;
  answers: unknown;
  created_at: unknown;
  completed_at: unknown;
};

export type PublicTest = {
  id: string;
  status: "in_progress" | "completed";
  paid: boolean;
  questions: ClientQuestion[];
  answers: Array<string | null>;
  createdAt: string;
  completedAt: string | null;
};

export type DashboardTest = {
  id: string;
  createdAt: string;
  completedAt: string | null;
  status: "in_progress" | "completed";
  paid: boolean;
  score: number | null;
};

function parseJson<T>(value: unknown): T {
  if (typeof value === "string") return JSON.parse(value) as T;
  return value as T;
}

function iso(value: unknown): string | null {
  if (value == null) return null;
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function asBool(value: unknown): boolean {
  return value === true || value === "t" || value === "true";
}

async function loadQuestions() {
  return import("@/lib/questions.server");
}

async function toPublicTest(row: TestRow): Promise<PublicTest> {
  const { hydrateClientQuestion } = await loadQuestions();
  const stored = parseJson<StoredQuestion[]>(row.questions);
  const answers = parseJson<Array<string | null>>(row.answers);
  return {
    id: row.id,
    status: row.status === "completed" ? "completed" : "in_progress",
    paid: asBool(row.paid),
    questions: stored.map(hydrateClientQuestion),
    answers,
    createdAt: iso(row.created_at) ?? new Date().toISOString(),
    completedAt: iso(row.completed_at),
  };
}

async function getTestForUser(userId: string, testId: string): Promise<TestRow | null> {
  const sql = await getSql();
  const rows = await sql<TestRow>`
    select * from tests where id = ${testId} and user_id = ${userId} limit 1
  `;
  return rows[0] ?? null;
}

export const getPaymentConfig = createServerFn({ method: "GET" }).handler(async () => {
  const { stripeConfigured } = await import("@/lib/stripe.server");
  return {
    enabled: stripeConfigured(),
    priceLabel: PRICE_LABEL,
    priceCents: PRICE_CENTS,
    currency: PRICE_CURRENCY,
  };
});

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<TestRow>`
      select id, user_id, status, paid, score, correct_count, questions, answers, created_at, completed_at,
             stripe_session_id, stripe_payment_intent_id
      from tests
      where user_id = ${context.userId}
      order by created_at desc
    `;
    const tests: DashboardTest[] = rows.map((row) => ({
      id: row.id,
      createdAt: iso(row.created_at) ?? "",
      completedAt: iso(row.completed_at),
      status: row.status === "completed" ? "completed" : "in_progress",
      paid: asBool(row.paid),
      score: asBool(row.paid) ? row.score : null,
    }));
    const inProgress = tests.find((t) => t.status === "in_progress") ?? null;
    return { tests, inProgress };
  });

export const startOrResumeTest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const existing = await sql<TestRow>`
      select * from tests
      where user_id = ${context.userId} and status = 'in_progress'
      order by created_at desc
      limit 1
    `;
    if (existing[0]) return toPublicTest(existing[0]);

    const { selectTestQuestions } = await loadQuestions();
    const questions = selectTestQuestions();
    if (questions.length !== TEST_LENGTH) {
      throw new Error("Could not assemble a full test.");
    }
    const answers = questions.map(() => null);
    const id = crypto.randomUUID();
    await sql.query(
      `insert into tests (id, user_id, status, paid, questions, answers)
       values ($1, $2, 'in_progress', false, $3::jsonb, $4::jsonb)`,
      [id, context.userId, JSON.stringify(questions), JSON.stringify(answers)],
    );
    const created = await getTestForUser(context.userId, id);
    if (!created) throw new Error("We couldn't load your test. Please refresh and try again.");
    return toPublicTest(created);
  });

export const getTest = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { testId: string }) => {
    if (!data?.testId) throw new Error("Missing test id");
    return data;
  })
  .handler(async ({ context, data }) => {
    const row = await getTestForUser(context.userId, data.testId);
    if (!row) throw new Error("Test not found");
    return toPublicTest(row);
  });

export const getActiveTest = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<TestRow>`
      select * from tests
      where user_id = ${context.userId} and status = 'in_progress'
      order by created_at desc
      limit 1
    `;
    if (!rows[0]) return null;
    return toPublicTest(rows[0]);
  });

export const saveAnswer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { testId: string; index: number; key: string | null }) => {
    if (!data?.testId || typeof data.index !== "number") {
      throw new Error("Invalid answer");
    }
    return data;
  })
  .handler(async ({ context, data }) => {
    const row = await getTestForUser(context.userId, data.testId);
    if (!row) throw new Error("Test not found");
    if (row.status !== "in_progress") throw new Error("This test is already complete.");
    const stored = parseJson<StoredQuestion[]>(row.questions);
    const answers = parseJson<Array<string | null>>(row.answers);
    if (data.index < 0 || data.index >= stored.length) {
      throw new Error("Invalid question");
    }
    const question = stored[data.index]!;
    if (data.key != null && !question.optionKeys.includes(data.key)) {
      throw new Error("Invalid option");
    }
    answers[data.index] = data.key;
    const sql = await getSql();
    await sql.query(`update tests set answers = $1::jsonb where id = $2 and user_id = $3`, [
      JSON.stringify(answers),
      data.testId,
      context.userId,
    ]);
    return { ok: true as const };
  });

export const completeTest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { testId: string }) => {
    if (!data?.testId) throw new Error("Missing test id");
    return data;
  })
  .handler(async ({ context, data }) => {
    const row = await getTestForUser(context.userId, data.testId);
    if (!row) throw new Error("Test not found");
    if (row.status === "completed") {
      return { testId: row.id, paid: asBool(row.paid) };
    }
    const stored = parseJson<StoredQuestion[]>(row.questions);
    const answers = parseJson<Array<string | null>>(row.answers);
    if (answers.length !== stored.length || answers.some((a) => a == null)) {
      throw new Error("Please answer every question before finishing.");
    }
    let correct = 0;
    for (let i = 0; i < stored.length; i += 1) {
      if (answers[i] === stored[i]!.correctKey) correct += 1;
    }
    const score = scoreFromCorrectCount(correct);
    const sql = await getSql();
    await sql`
      update tests
      set status = 'completed',
          completed_at = now(),
          correct_count = ${correct},
          score = ${score}
      where id = ${data.testId} and user_id = ${context.userId}
    `;
    return { testId: data.testId, paid: false };
  });

export const getPaywall = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { testId: string }) => {
    if (!data?.testId) throw new Error("Missing test id");
    return data;
  })
  .handler(async ({ context, data }) => {
    const { stripeConfigured } = await import("@/lib/stripe.server");
    const row = await getTestForUser(context.userId, data.testId);
    if (!row) throw new Error("Test not found");
    if (row.status !== "completed") throw new Error("This test is not complete.");
    return {
      testId: row.id,
      paid: asBool(row.paid),
      completedAt: iso(row.completed_at),
      paymentsEnabled: stripeConfigured(),
      priceLabel: PRICE_LABEL,
    };
  });

export const startCheckout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { testId: string }) => {
    if (!data?.testId) throw new Error("Missing test id");
    return data;
  })
  .handler(async ({ context, data }) => {
    const row = await getTestForUser(context.userId, data.testId);
    if (!row) throw new Error("Test not found");
    if (row.status !== "completed") throw new Error("This test is not complete.");
    if (asBool(row.paid)) {
      return { url: `/results/${row.id}`, preview: false, alreadyPaid: true };
    }

    const { getStripe, markTestPaid } = await import("@/lib/stripe.server");
    const stripe = getStripe();
    if (!stripe) {
      // Preview / local: Stripe keys are not set. Unlock server-side so the
      // result flow can be demonstrated. Never used when a secret key exists.
      await markTestPaid({
        testId: row.id,
        userId: context.userId,
        sessionId: `preview_${row.id}`,
        paymentIntentId: null,
      });
      return { url: `/results/${row.id}`, preview: true, alreadyPaid: false };
    }

    const { getRequestOrigin } = await import("@/lib/origin.server");
    const origin = getRequestOrigin();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: PRICE_CURRENCY,
            unit_amount: PRICE_CENTS,
            product_data: {
              name: "IQ Test Result",
              description: "One-time unlock of your IQ-style assessment score.",
            },
          },
        },
      ],
      metadata: {
        testId: row.id,
        userId: context.userId,
      },
      client_reference_id: row.id,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel?testId=${encodeURIComponent(row.id)}`,
    });
    if (!session.url) throw new Error("Unable to start checkout. Please try again.");

    const sql = await getSql();
    await sql`
      update tests set stripe_session_id = ${session.id}
      where id = ${row.id} and user_id = ${context.userId}
    `;

    return { url: session.url, preview: false, alreadyPaid: false };
  });

export const confirmCheckoutSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { sessionId: string }) => {
    if (!data?.sessionId) throw new Error("Missing session");
    return data;
  })
  .handler(async ({ context, data }) => {
    const { getStripe, markTestPaid } = await import("@/lib/stripe.server");
    const stripe = getStripe();
    if (!stripe) throw new Error("Payments are not configured");
    const session = await stripe.checkout.sessions.retrieve(data.sessionId);
    if (session.payment_status !== "paid") {
      return { ok: false as const, testId: null as string | null };
    }
    const testId = session.metadata?.testId;
    const userId = session.metadata?.userId;
    if (!testId || userId !== context.userId) {
      throw new Error("This payment does not match your account.");
    }
    const paymentIntent =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;
    await markTestPaid({
      testId,
      userId: context.userId,
      sessionId: session.id,
      paymentIntentId: paymentIntent,
    });
    return { ok: true as const, testId };
  });

export const getResult = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { testId: string }) => {
    if (!data?.testId) throw new Error("Missing test id");
    return data;
  })
  .handler(async ({ context, data }) => {
    const row = await getTestForUser(context.userId, data.testId);
    if (!row) throw new Error("Result not found");
    if (row.status !== "completed") throw new Error("This test is not complete.");
    if (!asBool(row.paid)) {
      throw new Error("LOCKED");
    }
    return {
      testId: row.id,
      score: row.score ?? 0,
      completedAt: iso(row.completed_at),
    };
  });
