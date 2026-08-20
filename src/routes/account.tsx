import { createFileRoute, Link } from "@tanstack/react-router";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PageShell } from "@/components/page-shell";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/account")({ component: AccountPage });

function AccountPage() {
  return (
    <PageShell>
      <RequireAuth>
        <AccountInner />
      </RequireAuth>
    </PageShell>
  );
}

function AccountInner() {
  const { user } = useCurrentUserState();
  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">Account</h1>
      <Card className="mt-8 rounded-xl p-6">
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-fg-subtle">Name</dt>
            <dd className="mt-0.5 font-medium">{user?.displayName ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-fg-subtle">Email</dt>
            <dd className="mt-0.5 font-medium">{user?.primaryEmail ?? "—"}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-col gap-2">
          <Button asChild variant="secondary">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button type="button" variant="outline" onClick={() => void signOut("/")}>
            Log out
          </Button>
        </div>
      </Card>
    </div>
  );
}
