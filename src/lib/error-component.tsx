import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  const expired =
    error.message === "Unauthorized" ||
    /session/i.test(error.message ?? "");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg">
      <span className="text-danger" aria-hidden="true">
        <TriangleAlert className="size-8" strokeWidth={1.75} />
      </span>
      <h1 className="font-display text-2xl font-semibold">
        {expired ? "Your session has expired" : "Something went wrong"}
      </h1>
      <p className="max-w-md text-sm text-fg-muted">
        {expired
          ? "Please sign in again."
          : error.message || "An unexpected error occurred. Try reloading the page."}
      </p>
      <Link
        to={expired ? "/login" : "/"}
        className="mt-2 text-sm font-medium text-primary hover:underline"
      >
        {expired ? "Sign in" : "Back to home"}
      </Link>
    </main>
  );
}
