import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-bg-subtle/50">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="max-w-sm space-y-3">
          <Logo />
          <p className="text-sm leading-relaxed text-fg-muted">
            This online assessment is intended for entertainment and informational
            purposes and is not a clinically validated intelligence test.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted">
          <Link to="/privacy" className="hover:text-fg">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-fg">
            Terms of Service
          </Link>
          <Link to="/refund" className="hover:text-fg">
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
