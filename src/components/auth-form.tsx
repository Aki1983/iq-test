import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/loading-state";
import { Logo } from "@/components/logo";

function messageFromError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "message" in err && typeof err.message === "string") {
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isSignup = mode === "signup";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setPending(true);
    try {
      if (isSignup) {
        const { error: signUpError } = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: email.trim().split("@")[0] ?? "Member",
        });
        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } = await authClient.signIn.email({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
      }
      await navigate({ to: "/dashboard" });
    } catch (err) {
      setError(
        messageFromError(
          err,
          isSignup ? "Could not create your account." : "Could not sign you in.",
        ),
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-bg px-4 py-12">
      <Logo />
      <Card className="mt-8 w-full max-w-md rounded-xl p-6 sm:p-8">
        <h1 className="font-display text-2xl font-semibold">
          {isSignup ? "Create your account" : "Sign in"}
        </h1>
        <p className="mt-1 text-sm text-fg-muted">
          {isSignup
            ? "Start the 25-question assessment after you register."
            : "Welcome back. Continue your assessment or view results."}
        </p>

        {error && (
          <div className="mt-4">
            <ErrorMessage title={isSignup ? "Sign up failed" : "Sign in failed"} message={error} />
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={(e) => void onSubmit(e)}>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
          </Button>
        </form>

        {authEnabled && (
          <div className="mt-6 space-y-2">
            <p className="text-center text-xs tracking-wide text-fg-subtle uppercase">
              Or continue with
            </p>
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => void signIn(p.providerId, { callbackURL: "/dashboard" })}
              >
                Continue with {p.label}
              </Button>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-fg-muted">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </>
          ) : (
            <>
              New here?{" "}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                Create an account
              </Link>
            </>
          )}
        </p>
      </Card>
    </div>
  );
}
