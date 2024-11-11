import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/login/login' || path === '/login';

  const token = request.cookies.get('connect.sid')?.value || '';

  if (isPublicPath && token) { return NextResponse.redirect(new URL('/dashboard', request.nextUrl)); }


  if (!isPublicPath && !token) { return NextResponse.redirect(new URL('/login', request.nextUrl)); }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/login/:path*',
  ],
};



// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;

//   const isPublicPath = path === '/login' || path === '/';

//   const token = request.cookies.get('connect.sid')?.value || '';

//   if (isPublicPath && token) {
//     return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
//   }

//   if (!isPublicPath && !token) {
//     return NextResponse.redirect(new URL('/login', request.nextUrl));
//   }
// }

// export const config = {
//   matcher: [
//     '/',
//     '/dashboard/:path*',
//     '/login',
//   ],
// };