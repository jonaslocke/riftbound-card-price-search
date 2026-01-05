import { UserRole } from "@/features/authentication/schema";
import { ReactNode } from "react";

export type AllowedUsers = {
  allowRoles: UserRole[];
  denyRoles?: never;
  isLogged?: never;
};

export type DeniedUsers = {
  allowRoles?: never;
  denyRoles: UserRole[];
  isLogged?: never;
};

export type LoggedUsers = {
  allowRoles?: never;
  denyRoles?: never;
  isLogged: boolean;
};

export type RoleGuardProps = (AllowedUsers | DeniedUsers | LoggedUsers) & {
  children: ReactNode;
  fallback?: ReactNode;
};

