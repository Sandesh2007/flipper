import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const protectedRoutes = ['/protected', '/profile', '/protected/profile']

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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/auth/')
  ) {
    // no user, potentially respond by redirecting the user to the register page
    const url = request.nextUrl.clone()
    url.pathname = '/auth/register'
    return NextResponse.redirect(url)
  }

  const pathname = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(pathname)

  const session = await supabase.auth.getUser()

  if (isProtectedRoute && session.error) {
    return NextResponse.redirect(new URL('/auth/register', request.url))
  }

  return supabaseResponse
}