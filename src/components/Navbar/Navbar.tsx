'use client'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
export function Navbar() {
	const { user, logout } = useAuthStore()

	return (
		<nav className="bg-blue-600 text-white p-4">
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
								className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
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
