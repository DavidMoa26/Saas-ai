import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Get the pathname from the request URL
    const pathname = new URL(req.url).pathname;

    // If the user is not logged in and is trying to access a path other than the root
    if (!req.nextauth.token && pathname !== '/') {
      // Redirect them to the root path
      return NextResponse.rewrite(new URL("/", req.url));
    }

    // Continue with the normal flow for other cases
    return NextResponse.next();
  },
  {
    callbacks: {
      // Authorize the user if they have a token or are requesting the root path
      authorized: ({ token, req }) => {
        const pathname = new URL(req.url).pathname;
        return !!token || pathname === '/';
      },
    }
  }
);

export const config = {
  matcher: ["/dashboard", "/code", "/music", "/video", "/conversion", "/image"],
};
