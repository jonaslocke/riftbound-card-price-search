"use client";

import { RoleGuardProps } from "@/lib/users/types";
import { useSession } from "next-auth/react";

export default function RoleGuard({
  allowRoles,
  children,
  denyRoles,
  fallback,
  isLogged,
}: RoleGuardProps) {
  const session = useSession();

  if (isLogged) {
    return <>{session.data ? children : fallback}</>;
  }

  if (!session.data) {
    return null;
  }

  const userRole = session.data.user.userRole;

  if (allowRoles && allowRoles.includes(userRole)) {
    return <>{children}</>;
  }

  if (denyRoles && !denyRoles.includes(userRole)) {
    return <>{children}</>;
  }
  return <>{fallback ?? null}</>;
}
