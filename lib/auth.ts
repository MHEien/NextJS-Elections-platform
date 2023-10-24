import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import { getServerSession, type NextAuthOptions } from "next-auth";
import AzureAD from "next-auth/providers/azure-ad";
import Email from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    AzureAD({
      clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_AZURE_CLIENT_SECRET as string,
      tenantId: process.env.NEXT_PUBLIC_AZURE_TENANT_ID as string,
      profile(profile) {
        return {
          id: profile.oid,
          name: profile.name || profile.login,
          email: profile.email,
          role: "ADMIN"
        };
      },
    }),
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST as string,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER as string,
          pass: process.env.EMAIL_SERVER_PASSWORD as string,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
    error: "/login", // Error code passed in query string as ?error=
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user }) => {
    if (user) {
      // Fetch user from the database
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      // Assign the user's role from the database to the token
      if (dbUser) {
        token.id = dbUser.id;
        token.role = dbUser.role;
      }

      token.user = user;
    }
    return token;
  },
    session: async ({ session, token }) => {
      session.user = {
        ...session.user,
        id: token?.id,
        name: token?.name,
        role: token?.role
      };
      return session;
    },
    signIn: async ({ user, account, email }) => {
      //Only let existing users sign in with EmailProvider
      if (account?.provider === "email") {
        if (!user.email) {
          return false;
        }
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (!existingUser) {
          return false;
        }
      }
      return true;
    }
  },
};

export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
  return getServerSession(...args, authOptions);
}