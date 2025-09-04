'use client'
import { useGates } from '@/hooks/useGates'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'
import * as motion from 'motion/react-client'
import { AdminCard } from '@/components'
import { CheckpointCard } from '@/components/CheckpointCard'

export default function Home() {
	const { user } = useAuthStore()
	const { data: gates, isLoading, error } = useGates()

	return (
		<div className="min-h-screen p-8">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#ef4937] to-[#ff6b5b]"
			>
				Parking Reservation System
			</motion.h1>

			{/* Gates Section */}
			<section className="mb-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
				<h2 className="text-2xl font-semibold mb-6 flex items-center text-[#333333]">
					<span className="mr-2">🚪</span>
					Available Gates ( {gates?.length} )
				</h2>

				{isLoading && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-8"
					>
						<div className="spinner-border animate-spin inline-block w-10 h-10 border-4 rounded-full border-[#ef4937] border-t-transparent"></div>
						<p className="mt-4 text-[#ef4937]">Loading gates...</p>
					</motion.div>
				)}

				{error && (
					<div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg mb-6">
						<p className="text-red-700 flex items-center">
							<span className="mr-2">⚠️</span>
							Error loading gates: {error.message}
						</p>
					</div>
				)}

				{gates && gates.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{gates.map((gate) => (
							<motion.div
								key={gate.id}
								whileHover={{ scale: 1.02, y: -5 }}
								whileTap={{ scale: 0.98 }}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#ef4937]/10"
							>
								<h3 className="font-semibold text-xl mb-3 text-[#333333]">
									{gate.name}
								</h3>
								<p className="text-[#666666] mb-4 flex items-center">
									<span className="mr-2">📍</span>
									{gate.location}
								</p>
								<motion.div whileHover={{ scale: 1.02 }}>
									<Link
										href={`/gate/${gate.id}`}
										className="inline-block w-full text-center bg-[#ef4937] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#d43826] transition-all duration-200"
									>
										Access Gate
									</Link>
								</motion.div>
							</motion.div>
						))}
					</div>
				)}

				{gates && gates.length === 0 && (
					<div className="text-center py-8 text-[#666666] bg-[#ffeae8] rounded-xl">
						<p className="text-xl">No gates available at the moment</p>
					</div>
				)}
			</section>

			{/* Operations Section */}
			<section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-[#ef4937]/10"
						>
							<div className="text-center">
								<motion.span
									animate={{ rotate: 360 }}
									transition={{
										repeat: Infinity,
										duration: 10,
										ease: 'linear',
									}}
									className="text-4xl mb-4 block"
								>
									⚙️
								</motion.span>
								<h2 className="text-2xl font-bold mb-4 text-[#333333]">
									Admin Login
								</h2>
								<p className="mb-6 text-[#666666]">
									Access system configuration and reports
								</p>
								<motion.div whileHover={{ scale: 1.02 }}>
									<Link
										href="/login?role=admin"
										className="inline-block bg-[#ef4937] text-white px-8 py-3 rounded-lg hover:bg-[#d43826] transition-all duration-200"
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
							className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-[#ef4937]/10"
						>
							<div className="text-center">
								<motion.span
									animate={{ rotate: [0, 10, -10, 0] }}
									transition={{ repeat: Infinity, duration: 2 }}
									className="text-4xl mb-4 block"
								>
									🚗
								</motion.span>
								<h2 className="text-2xl font-bold mb-4 text-[#333333]">
									Checkpoint Login
								</h2>
								<p className="mb-6 text-[#666666]">
									Process vehicle check-outs and payments
								</p>
								<motion.div whileHover={{ scale: 1.02 }}>
									<Link
										href="/login?role=checkpoint"
										className="inline-block bg-[#ef4937] text-white px-8 py-3 rounded-lg hover:bg-[#d43826] transition-all duration-200"
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
