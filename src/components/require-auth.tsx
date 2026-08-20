import type { ReactNode } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { LoadingState } from "@/components/loading-state";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <LoadingState label="Loading your session…" />;
  if (!user) return <RedirectToSignIn />;
  return <>{children}</>;
}
