import { cn } from "@/lib/utils";

export function LoadingState({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[40vh] flex-col items-center justify-center gap-3 px-6 text-center",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span className="size-6 animate-spin rounded-full border-2 border-border-strong border-t-primary" />
      <p className="text-sm text-fg-muted">{label}</p>
    </div>
  );
}

export function ErrorMessage({
  title = "Something went wrong",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div
      className="rounded-lg bg-surface px-4 py-3 text-sm text-danger shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-danger)_25%,transparent)]"
      role="alert"
    >
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-fg-muted">{message}</p>
    </div>
  );
}
