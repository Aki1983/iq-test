import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({ component: Home });

const startHref = (signedIn: boolean) => (signedIn ? "/test" : "/signup");

function Home() {
  const { user, isPending } = useCurrentUserState();
  const signedIn = Boolean(user);
  const to = isPending ? "/signup" : startHref(signedIn);

  return (
    <PageShell landing>
      <section className="mx-auto max-w-5xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
            Online assessment
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-fg sm:text-6xl">
            Discover Your IQ
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">
            Complete a 25-question online IQ-style assessment covering pattern,
            number, verbal, spatial, and logical reasoning. Your score is
            calculated when you finish.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to={to}>Take the Test</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#how-it-works">How it works</a>
            </Button>
          </div>
        </div>

        <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-xl bg-border sm:grid-cols-4">
          {[
            ["25", "Questions"],
            ["None", "Timer"],
            ["7", "Reasoning types"],
            ["Instant", "Scoring"],
          ].map(([value, label]) => (
            <div key={label} className="bg-surface px-4 py-5 text-center">
              <dt className="text-xs tracking-wide text-fg-subtle uppercase">{label}</dt>
              <dd className="mt-1 font-display text-2xl font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="how-it-works" className="border-t border-border bg-surface/60 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl font-semibold">How it works</h2>
          <ol className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                n: "01",
                title: "Create your account",
                body: "Sign up with email and a password. Your progress and results stay tied to you.",
              },
              {
                n: "02",
                title: "Complete 25 questions",
                body: "Work at your own pace. Move forward or back. Answers are saved as you go — there is no timer.",
              },
              {
                n: "03",
                title: "Unlock your IQ score",
                body: "When you finish, your score is calculated and stored. Unlock it with a one-time payment of €4.79.",
              },
            ].map((step) => (
              <li key={step.n} className="rounded-xl bg-bg px-6 py-7 shadow-[var(--shadow-card)]">
                <p className="font-display text-sm text-primary">{step.n}</p>
                <h3 className="mt-3 font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl font-semibold">What you will be asked</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-fg-muted">
            Questions are drawn from a curated bank and mixed so difficulty rises
            across the test.
          </p>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Pattern recognition",
              "Number sequences",
              "Logical reasoning",
              "Spatial reasoning",
              "Verbal reasoning",
              "Odd one out & analogies",
            ].map((item) => (
              <li
                key={item}
                className="rounded-lg bg-surface px-4 py-3.5 text-sm shadow-[var(--shadow-card)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl font-semibold">Questions</h2>
          <Accordion type="single" collapsible className="mt-8">
            <AccordionItem value="time">
              <AccordionTrigger>How long does the test take?</AccordionTrigger>
              <AccordionContent>
                Most people finish in 20–40 minutes. There is no timer, and you can
                pause by leaving the page — your answers are saved automatically.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="real">
              <AccordionTrigger>Is this a real IQ test?</AccordionTrigger>
              <AccordionContent>
                No. This is an IQ-style assessment for entertainment and
                informational purposes. It is not clinically validated and is not
                used for diagnosis or professional evaluation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="account">
              <AccordionTrigger>Do I need an account?</AccordionTrigger>
              <AccordionContent>
                Yes. An account keeps your progress and results private and lets
                you return later to finish or view a paid score.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cost">
              <AccordionTrigger>How much does it cost?</AccordionTrigger>
              <AccordionContent>
                Taking the test is free. Unlocking your IQ-style score is a
                one-time payment of €4.79 per completed test. It is not a
                subscription.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="retake">
              <AccordionTrigger>Can I take the test again?</AccordionTrigger>
              <AccordionContent>
                Yes. Each new test draws a fresh mix of questions. Viewing that
                new result also requires a one-time €4.79 payment.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="score">
              <AccordionTrigger>How is the score calculated?</AccordionTrigger>
              <AccordionContent>
                Scoring is deterministic: the number of correct answers is mapped
                to an IQ-style scale. The mapping is fixed in the product and is
                not a clinical IQ measurement.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="border-t border-border bg-surface/60 py-16">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-semibold">Ready when you are</h2>
          <p className="mt-3 text-fg-muted">
            Twenty-five questions. No clock. A score waiting at the end.
          </p>
          <div className="mt-6">
            <Button asChild size="lg">
              <Link to={to}>Take the Test</Link>
            </Button>
          </div>
          <p className="mt-8 text-xs leading-relaxed text-fg-subtle">
            This online assessment is intended for entertainment and informational
            purposes and is not a clinically validated intelligence test.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
