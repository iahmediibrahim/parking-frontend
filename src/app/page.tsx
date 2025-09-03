'use client'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'

export default function Home() {
	const { user } = useAuthStore()

	return (
		<div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
					Parking Reservation System
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 border-t-4 border-blue-500">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">
							Gate Operations
						</h2>
						<p className="text-gray-600 mb-6">
							Manage vehicle check-ins for visitors and subscribers
						</p>
						<Link
							href="/gate/gate_1"
							className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
						>
							Access Gate
						</Link>
					</div>

					<div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 border-t-4 border-blue-500">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">
							Checkpoint Operations
						</h2>
						<p className="text-gray-600 mb-6">
							Process vehicle check-outs and payments
						</p>
						{user ? (
							<Link
								href="/checkpoint"
								className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
							>
								Access Checkpoint
							</Link>
						) : (
							<Link
								href="/login"
								className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
							>
								Login as Employee
							</Link>
						)}
					</div>
				</div>

				{user?.role === 'admin' && (
					<div className="mt-8 bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 border-t-4 border-purple-500">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">
							Admin Dashboard
						</h2>
						<p className="text-gray-600 mb-6">
							Manage system configuration and view reports
						</p>
						<Link
							href="/admin"
							className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-md hover:shadow-lg"
						>
							Access Admin Dashboard
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}
