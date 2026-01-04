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
};
