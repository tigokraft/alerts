// middleware.ts
import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  // If the user is going to /control or any sub-route...
  if (req.nextUrl.pathname.startsWith("/control")) {
    // Check if they have a valid token
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // If no token, redirect to /login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/control/:path*'], // Protect /control and deeper routes
}
