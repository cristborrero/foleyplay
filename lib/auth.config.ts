import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [],
  callbacks: {
    async jwt({ token, user, trigger, session: updateData }) {
      if (user) {
        token.id = user.id;
        if (user.name) token.name = user.name;
        token.approved = (user as Record<string, unknown>).approved ?? false;
        token.role = (user as Record<string, unknown>).role ?? 'user';
      }
      if (trigger === 'update' && updateData) {
        if (updateData.name) token.name = updateData.name;
        if (updateData.image !== undefined) token.picture = updateData.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      if (token.name) session.user.name = token.name as string;
      (session.user as any).approved = token.approved;
      (session.user as any).role = token.role;
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
