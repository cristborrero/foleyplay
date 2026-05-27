import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { getDb } from './db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const db = await getDb();
        const [user] = await db.select().from(users).where(eq(users.email, credentials.email as string)).limit(1);

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        let role = (user.role || 'user') as string;
        let approved = user.approved;

        if (user.email === process.env.ADMIN_EMAIL && role !== 'superadmin') {
          await db.update(users)
            .set({ role: 'superadmin', approved: true })
            .where(eq(users.id, user.id));
          role = 'superadmin';
          approved = true;
        } else if (role === 'admin' || role === 'superadmin') {
          approved = true;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          approved,
          role,
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') {
        try {
          if (!user.email) return true;
          const db = await getDb();
          let [dbUser] = await db.select().from(users).where(eq(users.email, user.email)).limit(1);
          
          if (!dbUser) {
            const isSuperAdmin = user.email === process.env.ADMIN_EMAIL;
            const newId = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2);
            const [createdUser] = await db.insert(users).values({
              id: newId,
              name: user.name || user.email.split('@')[0] || 'Usuario',
              email: user.email,
              approved: isSuperAdmin,
              role: isSuperAdmin ? 'superadmin' : 'user',
            }).returning();
            dbUser = createdUser;
          } else if (user.email === process.env.ADMIN_EMAIL && dbUser.role !== 'superadmin') {
            const [updatedUser] = await db.update(users)
              .set({ role: 'superadmin', approved: true })
              .where(eq(users.id, dbUser.id))
              .returning();
            dbUser = updatedUser || dbUser;
          }
          
          user.id = dbUser.id;
          (user as Record<string, unknown>).approved =
            dbUser.role === 'admin' || dbUser.role === 'superadmin' ? true : dbUser.approved;
          (user as Record<string, unknown>).role = dbUser.role || 'user';
        } catch (e) {
          // No bloqueamos el login si la DB falla
        }
      }
      return true;
    },
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
      if (session.user && token.id) session.user.id = token.id as string;
      if (token.name) session.user.name = token.name as string;
      session.user.approved = token.approved as boolean | undefined;
      session.user.role = token.role as string | undefined;
      return session;
    },
  },
});