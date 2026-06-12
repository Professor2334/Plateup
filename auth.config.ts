import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [], // Configured in lib/auth.ts to avoid Edge Runtime issues
  callbacks: {
    async jwt({ token, user, trigger, session }: { token: any, user: any, trigger?: string, session?: any }) {
      if (user) {
        token.sub = user.id;
        token.emailVerified = !!user.emailVerified;
        token.onboardingCompleted = user.onboardingCompleted;
      }
      if (trigger === "update" && session?.user) {
        if (session.user.onboardingCompleted !== undefined) {
          token.onboardingCompleted = session.user.onboardingCompleted;
        }
        if (session.user.emailVerified !== undefined) {
          token.emailVerified = session.user.emailVerified;
        }
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        (session.user as any).emailVerified = token.emailVerified;
        (session.user as any).onboardingCompleted = token.onboardingCompleted;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
