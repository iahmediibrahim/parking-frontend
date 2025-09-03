'use client'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
export function Navbar() {
	const { user, logout, isLoading } = useAuthStore()
	console.log(isLoading)
	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-[#ef4937]"></div>
				</div>
			</div>
		)
	}

	return (
		<nav className="bg-white shadow-sm text-[#ef4937] p-4">
			<div className="container mx-auto flex justify-between items-center">
				<Link href="/" className="text-xl font-bold">
					Parking Reservation System
				</Link>

				<div className="flex items-center space-x-4">
					{user ? (
						<>
							<span>Hello, {user.username}</span>
							{user.role === 'admin' && (
								<Link href="/admin" className="hover:underline">
									Admin Dashboard
								</Link>
							)}
							<button
								onClick={logout}
								className="bg-[#ef4937] hover:bg-[#d43a2a] text-white px-3 py-1 rounded transition-colors"
							>
								Logout
							</button>
						</>
					) : (
						<Link href="/login" className="hover:underline">
							Login
						</Link>
					)}
				</div>
			</div>
		</nav>
	)
}
