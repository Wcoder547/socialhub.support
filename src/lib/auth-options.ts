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
          // New user: let schema defaults set coins + socialCoins to 50
          await UserModel.create({
            name: user.name || "",
            email,
            photo: user.image || "",
          });
        } else {
          // Existing user: backfill coins + socialCoins once
          if (existing.coins == null) {
            existing.coins = 50;
          }

          if (!existing.socialCoins) {
            // whole object missing
            existing.socialCoins = {
              youtube: 50,
              facebook: 50,
              instagram: 50,
            };
          } else {
            // per-key backfill if any key is null/undefined
            if (existing.socialCoins.youtube == null)
              existing.socialCoins.youtube = 50;
            if (existing.socialCoins.facebook == null)
              existing.socialCoins.facebook = 50;
            if (existing.socialCoins.instagram == null)
              existing.socialCoins.instagram = 50;
          }

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
          (session.user as any).socialCoins = dbUser.socialCoins ?? {
            youtube: 0,
            facebook: 0,
            instagram: 0,
          };
        }
      }
      return session;
    },
  },
};
