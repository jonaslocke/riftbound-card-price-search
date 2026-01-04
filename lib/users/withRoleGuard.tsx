import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import type { ComponentType } from "react";
import { RoleGuardProps } from "./types";

export function withRoleGuard<P extends object>(
  Component: ComponentType<P>,
  options: Omit<RoleGuardProps, "children">
) {
  const RoleGuarded = async (props: P) => {
    const session = await getServerSession(authOptions);

    const { allowRoles, denyRoles, fallback, isLogged } = options;

    if (isLogged) {
      return <>{session ? <Component {...props} /> : fallback}</>;
    }

    if (!session) {
      return null;
    }

    const userRole = session.user.userRole;

    if (allowRoles && allowRoles.includes(userRole)) {
      return <Component {...props} />;
    }

    if (denyRoles && !denyRoles.includes(userRole)) {
      return <Component {...props} />;
    }
    return <>{fallback ?? null}</>;
  };

  RoleGuarded.displayName = `withRoleGuard(${
    Component.displayName ?? Component.name ?? "Component"
  })`;
  return RoleGuarded;
}
