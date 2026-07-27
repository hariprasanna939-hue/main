import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value;
  const { pathname } = request.nextUrl;

  // Define public routes in the admin namespace that do not require authentication
  const isPublicAdminRoute =
    pathname === '/admin/login' ||
    pathname === '/admin/forgot-password' ||
    pathname === '/admin/reset-password' ||
    pathname.startsWith('/admin/reset-password');

  if (pathname.startsWith('/admin')) {
    // If the admin session token is missing and we're trying to access a protected page,
    // redirect to the login screen.
    if (!token && !isPublicAdminRoute) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
