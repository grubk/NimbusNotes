import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

function isMobileDevice(userAgent: string): boolean {
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
}

export default clerkMiddleware((auth, req: NextRequest) => {
  const userAgent = req.headers.get('user-agent') || '';
  
  // Skip mobile check for the error page itself to avoid infinite redirects
  if (req.nextUrl.pathname === '/mobile-error') {
    return NextResponse.next();
  }
  
  if (isMobileDevice(userAgent)) {
    return NextResponse.redirect(new URL('/mobile-error', req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};