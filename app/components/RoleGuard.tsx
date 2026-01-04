"use client";

import type { UserRole } from "@/lib/users/schema";
import { useSession } from "next-auth/react";
import type { ReactNode } from "react";

type AllowedUsers = {
  allowRoles: UserRole[];
  denyRoles?: never;
  isLogged?: never;
};

type DeniedUsers = {
  allowRoles?: never;
  denyRoles: UserRole[];
  isLogged?: never;
};

type LoggedUsers = {
  allowRoles?: never;
  denyRoles?: never;
  isLogged: boolean;
};

type Props = (AllowedUsers | DeniedUsers | LoggedUsers) & {
  children: ReactNode;
  fallback?: ReactNode;
};

export default function RoleGuard({
  allowRoles,
  children,
  denyRoles,
  fallback,
  isLogged,
}: Props) {
  const session = useSession();

  if (isLogged) {
    console.log(1);
    return <>{session.data ? children : fallback}</>;
  }

  if (!session.data) {
    console.log(2);
    return null;
  }

  const userRole = session.data.user.userRole;

  if (allowRoles && allowRoles.includes(userRole)) {
    console.log(3);
    return <>{children}</>;
  }

  if (denyRoles && !denyRoles.includes(userRole)) {
    console.log(4);
    return <>{children}</>;
  }
  console.log(5);
  return <>{fallback ?? null}</>;
}

// export function withRoleGuard<P extends object>(
//   WrappedComponent: ComponentType<P>,
//   options: RoleGuardOptions
// ): ComponentType<P> {
//   const RoleGuardedComponent = (props: P) => {
//     if ("allowRoles" in options) {
//       return (
//         <RoleGuard allowRoles={options.allowRoles}>
//           <WrappedComponent {...props} />
//         </RoleGuard>
//       );
//     }

//     return (
//       <RoleGuard denyRoles={options.denyRoles}>
//         <WrappedComponent {...props} />
//       </RoleGuard>
//     );
//   };

//   RoleGuardedComponent.displayName = `withRoleGuard(${
//     WrappedComponent.displayName ?? WrappedComponent.name ?? "Component"
//   })`;

//   return RoleGuardedComponent;
// }
