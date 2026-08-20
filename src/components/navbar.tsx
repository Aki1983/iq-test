import { Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <Skeleton className="h-9 w-24" />;
  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
          <Link to="/dashboard">Dashboard</Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => void signOut("/")}
        >
          Log out
        </Button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link to="/login">Sign In</Link>
      </Button>
      <Button asChild size="sm">
        <Link to="/signup">Start Test</Link>
      </Button>
    </div>
  );
}

export function Navbar({ landing = false }: { landing?: boolean }) {
  const { user } = useCurrentUserState();
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-3">
          {landing && (
            <a
              href="#how-it-works"
              className="hidden text-sm text-fg-muted transition-colors hover:text-fg sm:inline"
            >
              How It Works
            </a>
          )}
          {!landing && user && (
            <Link
              to="/account"
              className="hidden text-sm text-fg-muted transition-colors hover:text-fg sm:inline"
            >
              Account
            </Link>
          )}
          <AuthSlot />
        </nav>
      </div>
    </header>
  );
}

export { GROK_PROVIDERS, authEnabled };
