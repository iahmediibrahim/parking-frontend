// might delete later as we're already implementing middleware to handle protected routes

'use client'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
	children: React.ReactNode
	requiredRole?: 'admin' | 'employee'
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	requiredRole,
}) => {
	const { user, token } = useAuthStore()
	const router = useRouter()

	useEffect(() => {
		// Check if user is authenticated
		if (!user || !token) {
			router.push('/login')
			return
		}

		// Check if user has the required role
		if (requiredRole && user.role !== requiredRole) {
			router.push('/')
			return
		}
	}, [user, token, requiredRole, router])

	// Show loading state while checking authentication
	if (!user || !token) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600"></div>
					<p className="mt-2">Checking authentication...</p>
				</div>
			</div>
		)
	}

	// Check role if required
	if (requiredRole && user.role !== requiredRole) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-xl font-bold text-red-600">Access Denied</h2>
					<p className="mt-2">You don't have permission to access this page.</p>
				</div>
			</div>
		)
	}

	return <>{children}</>
}
