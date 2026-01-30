/**
 * NextAuth Configuration
 * Exported separately so it can be imported by other API routes
 */

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generatePublicToken } from "@/lib/token";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("User not found or invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return user;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days persistence
    updateAge: 24 * 60 * 60, // 24 Hours update
  },

  useSecureCookies: process.env.NODE_ENV === "production",

  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production"
        ? `__Secure-next-auth.session-token`
        : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60,
      },
    },
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async signIn({ user }) {
      // ✅ Ensure user exists in DB
      const existing = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existing) {
        // Create new user from OAuth
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            publicToken: generatePublicToken(),
            emailVerified: new Date(), // OAuth emails are verified
          },
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      // ✅ attach DB userId to token
      if (user) {
        token.id = user.id;
        token.onboarded = user.onboarded;
      } else {
        // Always fetch the latest onboarded status from DB
        // This ensures flag is synced on every token refresh
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, onboarded: true, emailVerified: true },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.onboarded = dbUser.onboarded;
          token.verified = !!dbUser.emailVerified;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // ✅ attach token data to session
      if (session?.user) {
        session.user.id = token.id;
        session.user.onboarded = token.onboarded;
        session.user.verified = token.verified;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/api/auth/error",
  },
};
