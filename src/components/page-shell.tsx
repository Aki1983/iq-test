import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";

export function PageShell({
  children,
  landing = false,
  className,
}: {
  children: ReactNode;
  landing?: boolean;
  className?: string;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <Navbar landing={landing} />
      <main className={cn("flex-1", className)}>{children}</main>
      <Footer />
    </div>
  );
}
