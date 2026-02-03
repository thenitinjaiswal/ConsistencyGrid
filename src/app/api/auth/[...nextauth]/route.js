import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export const authOptions = {
  providers: [
    // ✅ Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // ✅ Credentials Login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;
        // password verify logic here

        // 🔐 ENSURE publicToken exists
        if (!user.publicToken) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              publicToken: crypto.randomUUID(),
            },
          });
        }

        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    /**
     * JWT callback
     * Runs on every login
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;

        // 🔥 ATTACH publicToken to JWT
        token.publicToken =
          user.publicToken || crypto.randomUUID();
      }
      return token;
    },

    /**
     * Session callback
     * Exposes data to client
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;

        // 🔥 THIS IS WHAT mobile-auth-callback NEEDS
        session.user.publicToken = token.publicToken;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
