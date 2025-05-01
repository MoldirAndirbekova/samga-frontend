import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};

// Define public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/reset-password'];

export function middleware(req: NextRequest) {
  // Mobile device check
  const userAgent = req.headers.get('user-agent') || '';
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);

  // Get the pathname of the requested URL
  const { pathname } = req.nextUrl;
  
  // Get the token from cookies
  const token = req.cookies.get('access_token')?.value;
  
  // Check if the route requires authentication
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
  
  // If it's not a public route and there's no token, redirect to login
  if (!isPublicRoute && !token) {
    const url = new URL('/login', req.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Mobile device restriction (only applies if authenticated)
  if (isMobile && !publicRoutes.includes(pathname)) {
    return new NextResponse('Access Denied. Mobile devices are not allowed on this page.', { status: 403 });
  }

  return NextResponse.next();
}

