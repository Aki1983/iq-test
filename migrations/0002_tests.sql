-- IQ Test application schema.
-- Per-user tests, stored question selections, answers, scores, and payments.
-- user_id is TEXT to match Better Auth ids (and the preview 'dev-user').

create table if not exists tests (
  id text primary key,
  user_id text not null,
  status text not null default 'in_progress',
  paid boolean not null default false,
  stripe_session_id text,
  stripe_payment_intent_id text,
  score integer,
  correct_count integer,
  questions jsonb not null,
  answers jsonb not null,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists tests_user_id_idx on tests (user_id);
create index if not exists tests_user_status_idx on tests (user_id, status);
create unique index if not exists tests_stripe_session_id_uidx
  on tests (stripe_session_id)
  where stripe_session_id is not null;

create table if not exists payments (
  id text primary key,
  user_id text not null,
  test_id text not null,
  stripe_session_id text unique,
  amount_cents integer not null,
  currency text not null default 'eur',
  status text not null,
  created_at timestamptz not null default now()
);

create index if not exists payments_user_id_idx on payments (user_id);
create index if not exists payments_test_id_idx on payments (test_id);
