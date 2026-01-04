import type { NextAuthOptions } from "next-auth";
import { getCollections } from "@/lib/mongodb/collections";
import { UserSchema } from "@/lib/users/schema";

export const userAuthCallbacks: NextAuthOptions["callbacks"] = {
  async signIn({ user, account }) {
    if (account?.provider !== "google") {
      return true;
    }

    const name = user.name ?? "";
    const email = user.email ?? "";
    const image = user.image ?? "";

    if (!name || !email || !image) {
      return false;
    }

    const { users } = await getCollections();
    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      const newUser = UserSchema.parse({
        name,
        email,
        image,
        userRole: "user",
      });
      await users.insertOne(newUser);
    }

    return true;
  },
  async jwt({ token, user, account }) {
    const tokenWithRole = token as typeof token & { userRole?: string };
    const email = token.email ?? user?.email;

    if (!email) {
      return token;
    }

    if (!tokenWithRole.userRole) {
      const { users } = await getCollections();
      const existingUser = await users.findOne({ email });
      tokenWithRole.userRole = existingUser?.userRole ?? "user";
    }

    if (user && account?.provider === "google") {
      token.name = user.name;
      token.email = user.email;
      token.picture = user.image;
    }

    return token;
  },
  async session({ session, token }) {
    const tokenWithRole = token as typeof token & { userRole?: string };

    if (session.user) {
      session.user.userRole = tokenWithRole.userRole ?? "user";
    }

    return session;
  },
};
