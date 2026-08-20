# IQ Test

A professional online IQ-style assessment. Visitors create an account, complete 25 questions, then unlock an IQ-style score with a one-time €4.79 payment.

This is **not** a clinically validated intelligence test. It is intended for entertainment and informational purposes.

## Stack

- React 19 + TypeScript
- TanStack Start (Vite) — deploys to Vercel
- Tailwind CSS
- Better Auth (email/password, plus Google and X)
- Postgres (Neon in production, embedded PGLite in local preview)
- Stripe Checkout (one-time payment)

## Local setup

```bash
npm install
npm run dev
```

The app listens on port 8080.

```bash
npm run build
npm run typecheck
```

## Environment variables

Do not hardcode secrets. Set these in Vercel (Project → Settings → Environment Variables).

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Production | Neon Postgres connection string |
| `STRIPE_SECRET_KEY` | Payments | Stripe secret key (`sk_test_…` or `sk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | Payments | Webhook signing secret (`whsec_…`) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Optional | Stripe publishable key (Checkout is created server-side; included for completeness) |
| `BETTER_AUTH_SECRET` | Production | Session signing secret |
| `BETTER_AUTH_URL` | Production | Public origin, e.g. `https://your-domain.com` |
| `GROK_AUTH_CLIENT_ID` / `GROK_AUTH_CLIENT_SECRET` | Optional | Injected for Google/X broker sign-in on this platform |

If `STRIPE_SECRET_KEY` is not set, the unlock button still works in local/preview so you can walk through the result page. That path is **never** used when a Stripe secret key is present.

## Stripe setup

1. Create a Stripe account and switch to test mode.
2. Copy the secret key into `STRIPE_SECRET_KEY`.
3. Product: **IQ Test Result**, one-time price **€4.79 EUR**. Checkout creates the price on the fly (`price_data`), so you do not have to create a Stripe Product first.
4. Add a webhook endpoint:

   - URL: `https://YOUR_DOMAIN/api/stripe/webhook`
   - Events: `checkout.session.completed`
   - Copy the signing secret into `STRIPE_WEBHOOK_SECRET`

5. For local webhook testing:

   ```bash
   stripe listen --forward-to localhost:8080/api/stripe/webhook
   ```

Payment is verified **server-side** in two places:

- Stripe webhook (`/api/stripe/webhook`)
- Checkout success page, which retrieves the session with the secret key

The client is never trusted to mark a result as paid.

## Database

Schema lives in `migrations/`:

- `0001_auth.sql` — Better Auth users, sessions, accounts
- `0002_tests.sql` — `tests` and `payments`

`tests` stores the selected question ids, shuffled option order, answers, score, payment status, and Stripe session id. Scoring runs only on the server. Correct answers are never sent to the browser.

## Scoring

Deterministic mapping from correct answers (out of 25) to an IQ-style score:

| Correct | Score |
| ---: | ---: |
| 0–5 | 70 |
| 6–8 | 80 |
| 9–11 | 90 |
| 12–14 | 100 |
| 15–17 | 110 |
| 18–20 | 120 |
| 21–22 | 130 |
| 23 | 135 |
| 24 | 140 |
| 25 | 145 |

See `src/lib/scoring.ts`. This is not a clinical IQ measurement.

## Questions

The bank is in `src/lib/questions.server.ts` (server-only): 60 curated items across pattern, number, logic, spatial, verbal, odd-one-out, and analogy. Each live test draws 5 questions from each of 5 difficulty bands (25 total) and shuffles answer order.

## Vercel deployment

This project builds with the Vercel Nitro preset (`npm run build`).

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Set the environment variables above.
4. Deploy.
5. Point the Stripe webhook at `https://YOUR_DOMAIN/api/stripe/webhook`.

`npm run build` also applies migrations to `DATABASE_URL`.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Landing |
| `/signup` `/login` | Email/password auth |
| `/dashboard` | Tests and results |
| `/test` | 25-question assessment |
| `/test/complete` | Paywall |
| `/checkout/success` `/checkout/cancel` | Stripe return |
| `/results/:id` | Paid IQ-style score |
| `/account` | Profile |
| `/privacy` `/terms` `/refund` | Legal placeholders |
