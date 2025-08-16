import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const protectedRoutes = ['/home/publisher', '/profile']
const publicAuthRoutes = ['/auth/register']
const passwordResetRoute = '/auth/update-password'

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
            supabaseResponse.cookies.set(name, value, {
              ...options,
              maxAge: 60 * 60 * 24 * 30, // 30 days
            }),
          )
        },
      },
    },
  )

  const pathname = request.nextUrl.pathname

  // Handle password reset route
  if (pathname === passwordResetRoute) {
    const searchParams = request.nextUrl.searchParams
    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type')
    
    if (tokenHash && type === 'recovery') {
      return supabaseResponse
    }
    
    // Also allow access if user is already authenticated for the case where token was already exchanged
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      return supabaseResponse
    }
    
    // No valid tokens or user, redirect to register
    const url = request.nextUrl.clone()
    url.pathname = '/auth/register'
    return NextResponse.redirect(url)
  }

  // For all other routes, get user normally
  const { data: { user } } = await supabase.auth.getUser()
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

  return supabaseResponse
}
