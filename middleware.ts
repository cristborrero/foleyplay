import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Required: OpenNext Cloudflare adapter needs a middleware.ts file present.
// Intentionally a no-op.
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon|.*\\.(?:webp|png|jpg|ico|svg)).*)'],
};
