import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const session = req.auth;
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/pending') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // Admin API with valid secret (curl / external access)
  if (pathname.startsWith('/api/admin')) {
    const secret = req.nextUrl.searchParams.get('secret');
    if (secret && secret === process.env.ADMIN_SECRET) {
      return NextResponse.next();
    }
  }

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const role = session.user?.role || 'user';
  const isStaff = role === 'admin' || role === 'superadmin';

  // Admin routes — staff only
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (!isStaff) return NextResponse.redirect(new URL('/', req.url));
    return NextResponse.next();
  }

  // Staff bypass the approved check
  if (isStaff) return NextResponse.next();

  // Block unapproved regular users
  if (!session.user?.approved) {
    return NextResponse.redirect(new URL('/pending', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon|.*\\.(?:webp|png|jpg|ico|svg)).*)'],
};
