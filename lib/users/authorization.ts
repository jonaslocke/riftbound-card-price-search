import type { Session } from "next-auth";
import type { User, UserRole } from "@/lib/users/schema";

export type RoleGuard = readonly UserRole[];

export function hasRole(role: UserRole, allowed: RoleGuard): boolean {
  return allowed.includes(role);
}

export function hasUserRole(
  user: Pick<User, "userRole"> | null | undefined,
  allowed: RoleGuard
): boolean {
  if (!user) return false;
  return hasRole(user.userRole, allowed);
}

export function getSessionRole(session: Session | null): UserRole | null {
  return session?.user?.userRole ?? null;
}

export function requireRole(
  session: Session | null,
  allowed: RoleGuard
): UserRole {
  const role = getSessionRole(session);
  if (!role || !hasRole(role, allowed)) {
    throw new Error("Unauthorized");
  }
  return role;
}
