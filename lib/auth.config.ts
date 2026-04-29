import type { NextAuthConfig } from 'next-auth';

// Edge-safe: no mongoose, no bcrypt, no Node.js-only APIs.
// Used exclusively by proxy.ts to decode the existing JWT without touching the DB.
export const authConfig: NextAuthConfig = {
  providers: [],
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token }) { return token; },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      if (token.name) session.user.name = token.name as string;
      session.user.approved = token.approved as boolean | undefined;
      session.user.role = token.role as string | undefined;
      return session;
    },
  },
};
