import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import dbConnect from './mongodb';
import { User } from '@/models/User';
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

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

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
          await User.findByIdAndUpdate(user._id, { role: 'superadmin', approved: true });
          role = 'superadmin';
          approved = true;
        } else if (role === 'admin' || role === 'superadmin') {
          approved = true;
        }

        return {
          id: user._id.toString(),
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
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') {
        try {
          if (!user.email) return true;
          await dbConnect();
          let dbUser = await User.findOne({ email: user.email });
          if (!dbUser) {
            const isSuperAdmin = user.email === process.env.ADMIN_EMAIL;
            dbUser = await User.create({
              name: user.name || user.email?.split('@')[0] || 'Usuario',
              email: user.email,
              approved: isSuperAdmin,
              role: isSuperAdmin ? 'superadmin' : 'user',
            });
          } else if (user.email === process.env.ADMIN_EMAIL && dbUser.role !== 'superadmin') {
            dbUser = await User.findByIdAndUpdate(dbUser._id, { role: 'superadmin', approved: true }, { new: true }) ?? dbUser;
          }
          user.id = dbUser._id.toString();
          (user as Record<string, unknown>).approved = (dbUser.role === 'admin' || dbUser.role === 'superadmin') ? true : dbUser.approved;
          (user as Record<string, unknown>).role = dbUser.role || 'user';
        } catch {
          // No bloqueamos el login si la DB falla
        }
      }
      return true;
    }
  }
});