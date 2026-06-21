/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from 'bcryptjs';
import db from "@/lib/db";
import { LoginSchema } from "@/lib/validators";
import { headers } from "next/headers";
import { authRateLimit } from "@/lib/rate-limit";

import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (user.email) {
        const existingUser = await db.user.findUnique({ where: { email: user.email } });
        if (existingUser) {
          const updateData: Record<string, unknown> = { lastLoginAt: new Date() };
          // Automatically verify email for Google sign-ins if not already verified
          if (account?.provider === "google" && !existingUser.emailVerified) {
            updateData.emailVerified = new Date();
          }
          await db.user.update({
            where: { email: user.email },
            data: updateData
          });
        }
      }
      return true;
    }
  },
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            emailVerified: user.emailVerified !== null,
            onboardingCompleted: user.onboardingCompleted,
          };
        }

        return null;
      },
    }),
  ],
});
