import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const protectedRoutes = ['/home/publisher', '/profile', '/protected/profile']
const publicAuthRoutes = ['/auth/register'];
const passwordResetRoute = '/auth/update-password';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(
              name,
              value,
              {
                ...options,
                maxAge: 60 * 60 * 24 * 30, // 30 days
              }
            )
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  // IMPORTANT: DO NOT REMOVE auth.getUser()
  // This is note for future me if i mess something up
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: sessionData } = await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(pathname)
  const isPublicAuthRoute = publicAuthRoutes.includes(pathname)

  // Handle protected routes
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/register'
    return NextResponse.redirect(url)
  }

  // Handle public auth routes (redirect logged-in users away)
  if (isPublicAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/home/publisher'
    return NextResponse.redirect(url)
  }

  // Handle password reset route - IMPROVED LOGIC
  if (pathname === passwordResetRoute) {
    const session = sessionData.session

    // Check if user is not logged in at all
    if (!user || !session) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/register'
      return NextResponse.redirect(url)
    }

    // Check URL parameters to determine if this is a password recovery flow
    const searchParams = request.nextUrl.searchParams
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    const type = searchParams.get('type')

    // If this is not a password recovery flow (no tokens or wrong type)
    const isPasswordRecovery = type === 'recovery' || (accessToken && refreshToken)

    if (!isPasswordRecovery) {
      // If user just logged in normally, redirect them away
      const url = request.nextUrl.clone()
      url.pathname = '/home/publisher'
      return NextResponse.redirect(url)
    }

    // Check if user's email is already confirmed
    // This can help prevent access after password has been successfully reset
    // Mainly if using old link again to reset password
    // OFC we don't want it ( ͡° ͜ʖ ͡° )
    if (user.email_confirmed_at) {
      const sessionExpiresAt = session.expires_at ? new Date(session.expires_at * 1000) : null
      const now = new Date()

      if (sessionExpiresAt) {
        // Calculate how much time is left in the session
        const timeUntilExpiry = sessionExpiresAt.getTime() - now.getTime()
        const sessionDuration = 60 * 60 * 1000
        const tenMinutes = 10 * 60 * 1000

        // If the session has been active for more than 50 minutes means it old ofc
        if (timeUntilExpiry < (sessionDuration - tenMinutes)) {
          const url = request.nextUrl.clone()
          url.pathname = '/'
          return NextResponse.redirect(url)
        }
      }
    }
  }

  return supabaseResponse
}
