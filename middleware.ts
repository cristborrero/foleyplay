import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/pending') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // Allow admin API with valid secret (for curl/external access)
  if (pathname.startsWith('/api/admin')) {
    const secret = req.nextUrl.searchParams.get('secret');
    if (secret && secret === process.env.ADMIN_SECRET) {
      return NextResponse.next();
    }
  }

  const token = req.auth;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const role = ((token.user as any)?.role as string) || 'user';
  const isStaff = role === 'admin' || role === 'superadmin';

  // Admin-only routes — require admin or superadmin role
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (!isStaff) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  // Admins and superadmins bypass the approved check
  if (isStaff) {
    return NextResponse.next();
  }

  // Block unapproved regular users
  if (!(token.user as any)?.approved) {
    return NextResponse.redirect(new URL('/pending', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon|.*\\.(?:webp|png|jpg|ico|svg)).*)'],
};
