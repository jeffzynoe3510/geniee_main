import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req) {
  const token = await getToken({ req });
  
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
  
    return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/virtual-try-on/:path*",
    "/skin-analysis/:path*",
    "/personal-fitness-coach/:path*",
    "/virtual-assistant/:path*",
    "/analyze-fit/:path*",
  ],
}; 