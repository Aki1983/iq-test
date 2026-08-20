import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md bg-surface px-3.5 text-base text-fg shadow-[0_0_0_1px_var(--color-border)] transition-[box-shadow] duration-150 placeholder:text-fg-subtle focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-primary)] disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
