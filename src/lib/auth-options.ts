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
          // Let Mongoose defaults set coins + socialCoins to 50
          await UserModel.create({
            name: user.name || "",
            email,
            photo: user.image || "",
          });
        } else if (existing.coins == null) {
          // backfill older users that might not have coins
          existing.coins = 50;
          await existing.save();
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
          (session.user as any).coins = dbUser.coins ?? 0;
        }
      }
      return session;
    },
  },
};
