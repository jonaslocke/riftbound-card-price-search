import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/features/authentication/schema";

declare module "next-auth" {
  interface Session {
    user: {
      userRole: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userRole?: UserRole;
  }
}

