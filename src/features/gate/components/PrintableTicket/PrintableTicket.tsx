'use client'
import { Ticket } from '@/core'
import { PrimaryButton } from '@/shared'
import * as motion from 'motion/react-client'
import { useEffect, useState } from 'react'

export function PrintableTicket({
	showTicket,
	setShowTicket,
	ticketData,
}: {
	showTicket: boolean
	setShowTicket: (show: boolean) => void
	ticketData: Ticket
}) {
	const [showGateAnimation, setShowGateAnimation] = useState(false)

	useEffect(() => {
		if (showTicket) {
			const timer = setTimeout(() => setShowGateAnimation(true), 500)
			return () => clearTimeout(timer)
		}
		setShowGateAnimation(false)
	}, [showTicket])

	return (
		<>
			{showTicket && ticketData && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-white rounded-lg p-6 max-w-md w-full relative"
					>
						{/* Gate Animation */}
						<div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24">
							<motion.div
								className="h-12 w-2 bg-gray-800 absolute left-0"
								style={{ transformOrigin: 'bottom' }}
							/>
							<motion.div
								className="h-12 w-2 bg-gray-800 absolute right-0"
								style={{ transformOrigin: 'bottom' }}
							/>
							<motion.div
								className="h-2 w-24 bg-red-600 absolute top-0"
								initial={{ rotateZ: 0 }}
								animate={showGateAnimation ? { rotateZ: 90 } : { rotateZ: 0 }}
								transition={{
									duration: 1.5,
									ease: [0.645, 0.045, 0.355, 1],
									delay: 0.2,
								}}
								style={{ transformOrigin: 'left' }}
							>
								<div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white animate-pulse" />
							</motion.div>
						</div>

						{/* Printable Ticket Section */}
						<div id="printable-ticket">
							<div className="border-2 border-dashed border-gray-300 p-4 mb-4">
								<div className="text-center mb-4">
									<h2 className="text-2xl font-bold">Parking Ticket</h2>
									<div className="text-sm text-gray-500">
										Valid for one entry
									</div>
								</div>

								<div className="space-y-3">
									<div className="flex justify-between">
										<span className="font-semibold">Ticket ID:</span>
										<span>{ticketData.id}</span>
									</div>
									<div className="flex justify-between">
										<span className="font-semibold">Zone:</span>
										<span>{ticketData.zoneId}</span>
									</div>
									<div className="flex justify-between">
										<span className="font-semibold">Gate:</span>
										<span>{ticketData.gateId}</span>
									</div>
									<div className="flex justify-between">
										<span className="font-semibold">Check-in:</span>
										<span>
											{new Date(ticketData.checkinAt).toLocaleString()}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="font-semibold">Type:</span>
										<span className="capitalize">{ticketData.type}</span>
									</div>
								</div>
							</div>
						</div>

						<div className="print:hidden flex justify-end space-x-4 mt-6">
							<button
								onClick={() => setShowTicket(false)}
								className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
							>
								Close
							</button>
							<PrimaryButton onClick={() => window.print()}>
								Print Ticket
							</PrimaryButton>
						</div>
					</motion.div>
				</div>
			)}
		</>
	)
}
