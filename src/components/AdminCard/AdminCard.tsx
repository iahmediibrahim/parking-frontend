import Link from 'next/link'
import * as motion from 'motion/react-client'
export function AdminCard() {
	return (
		<motion.div
			whileHover={{ scale: 1.01, y: -5 }}
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-[#ef4937]/10"
		>
			<div className="text-center">
				<motion.span
					animate={{ rotate: 360 }}
					transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
					className="text-4xl mb-4 block"
				>
					⚙️
				</motion.span>
				<h2 className="text-2xl font-bold mb-4 text-[#333333]">
					Admin Dashboard
				</h2>
				<p className="mb-6 text-[#666666]">
					Manage system configuration and view reports
				</p>
				<motion.div whileHover={{ scale: 1.02 }}>
					<Link
						href="/admin"
						className="inline-block bg-[#ef4937] text-white px-8 py-3 rounded-lg hover:bg-[#d43826] transition-all duration-200"
					>
						Access Admin Dashboard
					</Link>
				</motion.div>
			</div>
		</motion.div>
	)
}
