"use client";

import type { ComponentType, PropsWithChildren } from "react";
import { useSession } from "next-auth/react";
import type { UserRole } from "@/lib/users/schema";

type AllowRolesProps = {
  allowRoles?: readonly UserRole[];
  denyRoles?: never;
};

type DenyRolesProps = {
  allowRoles?: never;
  denyRoles?: readonly UserRole[];
};

type RoleGuardProps = PropsWithChildren<AllowRolesProps | DenyRolesProps>;

type RoleGuardOptions =
  | {
      allowRoles: readonly UserRole[];
      denyRoles?: never;
    }
  | {
      allowRoles?: never;
      denyRoles: readonly UserRole[];
    };

export default function RoleGuard({
  allowRoles,
  denyRoles,
  children,
}: RoleGuardProps) {
  const { data: session } = useSession();
  const role = session?.user?.userRole ?? null;

  const hasAllowRoles = Array.isArray(allowRoles);
  const hasDenyRoles = Array.isArray(denyRoles);

  if (hasAllowRoles === hasDenyRoles) {
    return null;
  }

  if (hasAllowRoles && (!role || !allowRoles.includes(role))) {
    return null;
  }

  if (hasDenyRoles && role && denyRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}

export function withRoleGuard<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: RoleGuardOptions
): ComponentType<P> {
  const RoleGuardedComponent = (props: P) => {
    if ("allowRoles" in options) {
      return (
        <RoleGuard allowRoles={options.allowRoles}>
          <WrappedComponent {...props} />
        </RoleGuard>
      );
    }

    return (
      <RoleGuard denyRoles={options.denyRoles}>
        <WrappedComponent {...props} />
      </RoleGuard>
    );
  };

  RoleGuardedComponent.displayName = `withRoleGuard(${
    WrappedComponent.displayName ?? WrappedComponent.name ?? "Component"
  })`;

  return RoleGuardedComponent;
}
