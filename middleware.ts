import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

const publicRoutes = ["/", "/auth/login", "/auth/register", "/auth/verify-email"]

export default auth((req: any) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth')

  if (isApiAuthRoute) return NextResponse.next()

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl))
  }

  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // Redirect to onboarding for authenticated users who haven't completed it.
  // Email verification is no longer required before accessing the application.
  if (isLoggedIn && !isPublicRoute && nextUrl.pathname !== '/dashboard/onboarding') {
    const user = req.auth?.user as any;
    if (!user?.onboardingCompleted) {
      return NextResponse.redirect(new URL("/dashboard/onboarding", nextUrl))
    }
  }

  return NextResponse.next()
})


export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
