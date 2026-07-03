/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

// Exact-match public routes
const PUBLIC_EXACT_ROUTES = new Set(["/", "/terms", "/privacy", "/contact"])

// Auth routes (unauthenticated-only pages)
const AUTH_ROUTES = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/verify-email",
  "/auth/forgot-password",
  "/auth/reset-password",
])

/**
 * Marketing/SEO route prefixes that are always publicly accessible.
 * Add new prefixes here as the content strategy expands — individual
 * pages within these prefixes do NOT need to be listed one-by-one.
 */
const PUBLIC_PREFIXES = [
  "/blog",
  "/how-",
  "/meal-",
  "/budget-",
  "/nigerian-",
  "/weekly-",
]

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT_ROUTES.has(pathname)) return true
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export default auth((req: any) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const pathname = nextUrl.pathname

  const isPublicRoute = isPublicPath(pathname)
  const isAuthRoute = AUTH_ROUTES.has(pathname)
  const isApiAuthRoute = pathname.startsWith('/api/auth')
  const isApiCronRoute = pathname.startsWith('/api/cron')
  const isTestRoute = pathname.startsWith('/api/test-reminder')

  // Always allow internal Next.js / API auth / cron routes
  if (isApiAuthRoute || isApiCronRoute || isTestRoute) return NextResponse.next()

  // Redirect logged-in users away from auth pages to the dashboard
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

  // Redirect logged-in users from the landing page to the dashboard
  if (isLoggedIn && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // Redirect authenticated users who haven't completed onboarding
  if (isLoggedIn && !isPublicRoute && !isAuthRoute && pathname !== '/dashboard/onboarding') {
    const user = req.auth?.user as any
    if (!user?.onboardingCompleted) {
      return NextResponse.redirect(new URL("/dashboard/onboarding", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
