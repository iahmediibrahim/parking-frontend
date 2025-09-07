'use client'
import { AdminCard, CheckpointCard, useAuthStore } from '@/features'
import { useGates } from '@/shared'
import * as motion from 'motion/react-client'
import Link from 'next/link'

export default function Home() {
	const { user } = useAuthStore()
	const { data: gates, isLoading, error, refetch } = useGates()

	return (
		<div className="min-h-screen p-8 bg-gradient-to-b from-white to-gray-50">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-6xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#ef4937] to-[#ff6b5b] drop-shadow-sm"
			>
				Parking Reservation System
			</motion.h1>

			{/* Gates Section */}
			<section className="mb-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
				<h2 className="text-3xl font-semibold mb-6 flex items-center text-[#333333]">
					<span className="mr-2">🚪</span>
					Available Gates
					<span className="ml-2 text-lg bg-[#ef4937] text-white px-3 py-1 rounded-full">
						{gates?.length || 0}
					</span>
				</h2>

				{isLoading && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-12"
					>
						<div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-[#ef4937] border-t-transparent"></div>
						<p className="mt-4 text-[#ef4937] font-medium">Loading gates...</p>
					</motion.div>
				)}

				{error && (
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg mb-6"
					>
						<p className="text-red-700 flex items-center">
							<span className="mr-2">⚠️</span>
							Error loading gates: {error.message}
						</p>
						<button
							onClick={() => refetch()}
							className="mt-4 text-red-600 hover:text-red-800 font-medium"
						>
							Try Again
						</button>
					</motion.div>
				)}

				{gates && gates.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{gates.map((gate, index) => (
							<motion.div
								key={gate.id}
								whileHover={{ scale: 1.02, y: -5 }}
								whileTap={{ scale: 0.98 }}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#ef4937]/10"
							>
								<div className="flex justify-between items-start mb-4">
									<h3 className="font-semibold text-xl text-[#333333]">
										{gate.name}
									</h3>
									<span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
										Active
									</span>
								</div>
								<p className="text-[#666666] mb-4 flex items-center">
									<span className="mr-2">📍</span>
									{gate.location}
								</p>
								<motion.div whileHover={{ scale: 1.02 }}>
									<Link
										href={`/gate/${gate.id}`}
										className="inline-block w-full text-center bg-[#ef4937] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#d43826] transition-all duration-200 shadow-sm hover:shadow-md"
									>
										Access Gate
									</Link>
								</motion.div>
							</motion.div>
						))}
					</div>
				)}

				{gates && gates.length === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-12 text-[#666666] bg-[#ffeae8] rounded-xl"
					>
						<span className="text-4xl mb-4 block">🚫</span>
						<p className="text-xl font-medium">
							No gates available at the moment
						</p>
						<p className="mt-2 text-sm">Please check back later</p>
					</motion.div>
				)}
			</section>

			{/* Operations Section */}
			<section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
				{user ? (
					user.role === 'admin' ? (
						<AdminCard />
					) : (
						<CheckpointCard isLoggedIn={true} />
					)
				) : (
					<>
						<motion.div
							whileHover={{ scale: 1.01, y: -5 }}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-[#ef4937]/10 hover:shadow-xl transition-all duration-300"
						>
							<div className="text-center">
								<motion.div
									animate={{ rotate: 360 }}
									transition={{
										repeat: Infinity,
										duration: 10,
										ease: 'linear',
									}}
									className="w-16 h-16 bg-[#ef4937]/10 rounded-full flex items-center justify-center mx-auto mb-6"
								>
									<span className="text-3xl">⚙️</span>
								</motion.div>
								<h2 className="text-2xl font-bold mb-4 text-[#333333]">
									Admin Portal
								</h2>
								<p className="mb-6 text-[#666666]">
									Manage system settings, view analytics, and generate reports
								</p>
								<motion.div whileHover={{ scale: 1.02 }}>
									<Link
										href="/login?role=admin"
										className="inline-block bg-[#ef4937] text-white px-8 py-3 rounded-lg hover:bg-[#d43826] transition-all duration-200 shadow-sm hover:shadow-md"
									>
										Login as Admin
									</Link>
								</motion.div>
							</div>
						</motion.div>

						<motion.div
							whileHover={{ scale: 1.01, y: -5 }}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-[#ef4937]/10 hover:shadow-xl transition-all duration-300"
						>
							<div className="text-center">
								<motion.div
									animate={{ rotate: [0, 10, -10, 0] }}
									transition={{ repeat: Infinity, duration: 2 }}
									className="w-16 h-16 bg-[#ef4937]/10 rounded-full flex items-center justify-center mx-auto mb-6"
								>
									<span className="text-3xl">🚗</span>
								</motion.div>
								<h2 className="text-2xl font-bold mb-4 text-[#333333]">
									Checkpoint Access
								</h2>
								<p className="mb-6 text-[#666666]">
									Handle vehicle entries, exits, and process payments
								</p>
								<motion.div whileHover={{ scale: 1.02 }}>
									<Link
										href="/login?role=checkpoint"
										className="inline-block bg-[#ef4937] text-white px-8 py-3 rounded-lg hover:bg-[#d43826] transition-all duration-200 shadow-sm hover:shadow-md"
									>
										Login as Employee
									</Link>
								</motion.div>
							</div>
						</motion.div>
					</>
				)}
			</section>
		</div>
	)
}
