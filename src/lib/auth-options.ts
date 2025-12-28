// lib/auth-options.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { dbConnect } from "../lib/dbConnect";
import UserModel from "../models/User.model";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
      try {
        await dbConnect();

        const email = user.email;
        if (!email) return false;

        const existing = await UserModel.findOne({ email });

        if (!existing) {
          await UserModel.create({
            name: user.name || "",
            email,
            photo: user.image || "",
          });
        }

        return true;
      } catch (error) {
        console.error("signIn error:", error);
        return false;
      }
    },

    async session({ session }) {
      if (session?.user?.email) {
        await dbConnect();
        const dbUser = await UserModel.findOne({
          email: session.user.email,
        }).lean();

        if (dbUser) {
          (session.user as any).id = dbUser._id.toString();
          (session.user as any).photo = dbUser.photo;
        }
      }
      return session;
    },
  },
};
