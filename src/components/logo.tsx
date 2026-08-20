import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn("flex items-center gap-2.5 text-fg no-underline", className)}
    >
      <svg
        viewBox="0 0 32 32"
        className="size-8 shrink-0"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="currentColor" />
        <circle cx="16" cy="16" r="8.2" fill="none" stroke="#F6F3EB" strokeWidth="1.4" />
        <circle cx="16" cy="16" r="4.6" fill="none" stroke="#F6F3EB" strokeWidth="1.4" />
        <circle cx="16" cy="16" r="1.7" fill="#F6F3EB" />
      </svg>
      <span className="font-display text-lg font-semibold tracking-tight">IQ Test</span>
    </Link>
  );
}
