import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

const publicRoutes = ["/", "/terms", "/privacy", "/contact"]
const authRoutes = ["/auth/login", "/auth/register", "/auth/verify-email", "/auth/forgot-password", "/auth/reset-password"]

export default auth((req: any) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth')

  if (isApiAuthRoute) return NextResponse.next()

  // Redirect logged-in users away from auth pages
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
    return NextResponse.next()
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl))
  }

  // Redirect logged-in users from landing page to dashboard (optional, but matching previous behavior)
  if (isLoggedIn && nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // Redirect to onboarding for authenticated users who haven't completed it
  if (isLoggedIn && !isPublicRoute && !isAuthRoute && nextUrl.pathname !== '/dashboard/onboarding') {
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
