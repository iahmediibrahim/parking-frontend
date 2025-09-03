import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
	// Get the auth cookie
	const authCookie = request.cookies.get('auth')

	// Define protected routes
	const protectedRoutes = ['/checkpoint', '/admin']
	const isProtectedRoute = protectedRoutes.some((route) =>
		request.nextUrl.pathname.startsWith(route),
	)

	// Define role-based routes
	const adminRoutes = ['/admin']
	const isAdminRoute = adminRoutes.some((route) =>
		request.nextUrl.pathname.startsWith(route),
	)

	// Check if user is authenticated
	let isAuthenticated = false
	let userRole = null

	if (authCookie?.value) {
		try {
			const authData = JSON.parse(authCookie.value)
			isAuthenticated = !!authData.user && !!authData.token
			userRole = authData.user?.role
		} catch {
			isAuthenticated = false
		}
	}

	// Redirect unauthenticated users from protected routes
	if (isProtectedRoute && !isAuthenticated) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	// Redirect non-admin users from admin routes
	if (isAdminRoute && userRole !== 'admin') {
		return NextResponse.redirect(new URL('/', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
}
