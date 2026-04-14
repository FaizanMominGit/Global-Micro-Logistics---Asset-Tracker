import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compareSync } from "bcrypt-ts";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("[Auth] Login attempt for:", credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          console.warn("[Auth] Missing email or password in credentials");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.password) {
          console.warn("[Auth] User not found:", credentials.email);
          return null;
        }

        const isPasswordValid = compareSync(credentials.password as string, user.password);
        console.log("[Auth] Password valid:", isPasswordValid);

        if (!isPasswordValid) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
});
