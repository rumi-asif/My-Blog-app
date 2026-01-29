import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuth = !!token;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isProtectedPage = 
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/write') ||
    request.nextUrl.pathname.startsWith('/settings') ||
    request.nextUrl.pathname.startsWith('/bookmarks') ||
    request.nextUrl.pathname.startsWith('/notifications');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to sign in
  if (isProtectedPage && !isAuth) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check admin access
  if (isAdminPage && (!isAuth || token.role !== 'ADMIN')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check writer access for write pages
  if (
    request.nextUrl.pathname.startsWith('/write') &&
    isAuth &&
    token.role !== 'WRITER' &&
    token.role !== 'ADMIN'
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/write/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/settings/:path*',
    '/bookmarks/:path*',
    '/notifications/:path*',
  ],
};

