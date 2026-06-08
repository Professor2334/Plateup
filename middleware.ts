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

  // Check onboarding status
  if (isLoggedIn && !isPublicRoute && nextUrl.pathname !== '/dashboard/onboarding') {
    const user = req.auth?.user as any;
    // Let user complete verification/onboarding
    if (user?.emailVerified && !user?.onboardingCompleted) {
      return NextResponse.redirect(new URL("/dashboard/onboarding", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
