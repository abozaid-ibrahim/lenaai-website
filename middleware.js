import { NextResponse } from 'next/server';

// Make sure the function is properly exported
export default function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // If the user is accessing the root path '/', redirect to '/dashbord'
  if (path === '/') {
    return NextResponse.redirect(new URL('/dashbord', request.url));
  }

  // Continue with the request for all other paths
  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: ['/'],
};