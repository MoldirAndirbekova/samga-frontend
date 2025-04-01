import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || '';
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);

  // Get the pathname of the requested URL
  const { pathname } = req.nextUrl;

  // Allow mobile access only to these routes
  const allowedRoutes = ['/', '/login', '/register'];

  if (isMobile && !allowedRoutes.includes(pathname)) {
    return new NextResponse('Access Denied. Mobile devices are not allowed on this page.', { status: 403 });
  }

  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: '/:path*',
};
