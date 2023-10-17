import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import { getServerSession, type NextAuthOptions } from "next-auth";
import AzureAD from "next-auth/providers/azure-ad";
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
          role: "VOTER"
        };
      },
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
        role: token?.role,
      };
      return session;
    },
  },
};

export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
  return getServerSession(...args, authOptions);
}