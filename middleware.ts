import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth-storage')
  let isAuthenticated = false

  try {
    if (authCookie) {
      const authState = JSON.parse(authCookie.value)
      isAuthenticated = authState.state.isAuthenticated
    }
  } catch (error) {
    console.error('Error parsing auth state:', error)
  }

  // If user is authenticated and trying to access auth pages
  if (isAuthenticated && ['/login', '/signup'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Allow access to all routes
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/signup'],
} 