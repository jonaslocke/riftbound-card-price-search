import { z } from "zod";

export const UserRoleSchema = z.enum(["user", "admin", "god"]);

export const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1),
  image: z.string().min(1),
  userRole: UserRoleSchema,
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type User = z.infer<typeof UserSchema>;
