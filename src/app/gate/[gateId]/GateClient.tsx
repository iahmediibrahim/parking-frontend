// Client Component
'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

import { Zone, Subscription } from '@/types'
import { useZones } from '@/hooks/useZones'
import { useCheckin } from '@/hooks/useTickets'
import { useSubscription } from '@/hooks/useSubscriptions'
import { useWebSocketStore } from '@/store/websocketStore'

export default function GateClient({ gateId }: { gateId: string }) {
	const [activeTab, setActiveTab] = useState<'visitor' | 'subscriber'>(
		'visitor',
	)
	const [selectedZone, setSelectedZone] = useState<string | null>(null)
	const [subscriptionId, setSubscriptionId] = useState('')
	const [verifiedSubscription, setVerifiedSubscription] =
		useState<Subscription | null>(null)
	const [showTicket, setShowTicket] = useState(false)
	const [ticketData, setTicketData] = useState<any>(null)

	const { data: zones, isLoading, error, refetch } = useZones(gateId)
	const { mutate: checkin, isPending: isCheckingIn } = useCheckin()
	const { data: subscription, refetch: verifySubscription } =
		useSubscription(subscriptionId)

	const { isConnected, subscribe, unsubscribe, messages } = useWebSocketStore()

	useEffect(() => {
		if (gateId) {
			console.log('subscript', gateId)
			subscribe(gateId)
		}

		return () => {
			if (gateId) {
				unsubscribe(gateId)
			}
		}
	}, [gateId, subscribe, unsubscribe])

	useEffect(() => {
		if (messages.length > 0) {
			const lastMessage = messages[messages.length - 1]
			if (lastMessage.type === 'zone-update') {
				refetch()
			}
		}
	}, [messages, refetch])

	const handleVerifySubscription = async () => {
		if (!subscriptionId) return

		try {
			await verifySubscription()
			if (subscription) {
				setVerifiedSubscription(subscription)
			}
		} catch (err) {
			console.error('Failed to verify subscription', err)
		}
	}

	const handleCheckin = () => {
		if (!selectedZone) return

		const checkinData = {
			gateId,
			zoneId: selectedZone,
			type: activeTab,
			...(activeTab === 'subscriber' &&
				verifiedSubscription && { subscriptionId: verifiedSubscription.id }),
		}

		checkin(checkinData, {
			onSuccess: (data) => {
				setTicketData(data.ticket)
				setShowTicket(true)
				setSelectedZone(null)
				setSubscriptionId('')
				setVerifiedSubscription(null)
			},
			onError: (error) => {
				console.error('Checkin failed', error)
				alert('Checkin failed. Please try again.')
			},
		})
	}

	if (isLoading) return <div>Loading...</div>
	if (error) return <div>Error loading gate data</div>

	return (
		<>
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold">Gate: {gateId}</h1>
					<div className="flex items-center">
						<div
							className={`w-3 h-3 rounded-full mr-2 ${
								isConnected ? 'bg-green-500' : 'bg-red-500'
							}`}
						/>
						<span>{isConnected ? 'Connected' : 'Disconnected'}</span>
					</div>
				</div>

				<div className="flex border-b mb-6">
					<button
						className={`py-2 px-4 font-medium ${
							activeTab === 'visitor'
								? 'border-b-2 border-blue-500 text-blue-600'
								: 'text-gray-500'
						}`}
						onClick={() => setActiveTab('visitor')}
					>
						Visitor
					</button>
					<button
						className={`py-2 px-4 font-medium ${
							activeTab === 'subscriber'
								? 'border-b-2 border-blue-500 text-blue-600'
								: 'text-gray-500'
						}`}
						onClick={() => setActiveTab('subscriber')}
					>
						Subscriber
					</button>
				</div>

				{activeTab === 'subscriber' && (
					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Subscription ID
						</label>
						<div className="flex">
							<input
								type="text"
								value={subscriptionId}
								onChange={(e) => setSubscriptionId(e.target.value)}
								className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter subscription ID"
							/>
							<button
								onClick={handleVerifySubscription}
								disabled={!subscriptionId}
								className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 disabled:bg-gray-400"
							>
								Verify
							</button>
						</div>

						{verifiedSubscription && (
							<div className="mt-4 p-4 bg-green-50 rounded-md">
								<h3 className="font-medium">Subscription Verified</h3>
								<p>Name: {verifiedSubscription.userName}</p>
								<p>Category: {verifiedSubscription.category}</p>
								<p>
									Status: {verifiedSubscription.active ? 'Active' : 'Inactive'}
								</p>
							</div>
						)}
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{zones?.map((zone: Zone) => (
						<motion.div
							key={zone.id}
							className={`border rounded-lg p-4 cursor-pointer transition-all ${
								selectedZone === zone.id ? 'ring-2 ring-blue-500' : ''
							} ${
								!zone.open ||
								(activeTab === 'visitor' && zone.availableForVisitors <= 0)
									? 'opacity-50 cursor-not-allowed'
									: ''
							}`}
							onClick={() => {
								if (
									zone.open &&
									(activeTab !== 'visitor' || zone.availableForVisitors > 0)
								) {
									setSelectedZone(zone.id)
								}
							}}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<h3 className="font-bold text-lg">{zone.name}</h3>
							<div className="mt-2 text-sm">
								<p>
									Available: {zone.free} / {zone.totalSlots}
								</p>
								<p>Reserved: {zone.reserved}</p>
								{activeTab === 'visitor' ? (
									<p>Available for visitors: {zone.availableForVisitors}</p>
								) : (
									<p>
										Available for subscribers: {zone.availableForSubscribers}
									</p>
								)}
								<p>
									Rates: ${zone.rateNormal} (normal) / ${zone.rateSpecial}{' '}
									(special)
								</p>
								<p className={zone.open ? 'text-green-600' : 'text-red-600'}>
									Status: {zone.open ? 'Open' : 'Closed'}
								</p>
							</div>
						</motion.div>
					))}
				</div>

				<div className="mt-6 flex justify-end">
					<button
						onClick={handleCheckin}
						disabled={
							!selectedZone ||
							(activeTab === 'subscriber' && !verifiedSubscription) ||
							isCheckingIn
						}
						className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
					>
						{isCheckingIn ? 'Processing...' : 'Check In'}
					</button>
				</div>
			</div>

			{showTicket && ticketData && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-white rounded-lg p-6 max-w-md w-full relative"
					>
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
							<button
								onClick={() => window.print()}
								className="btn-primary px-4 py-2 rounded-md"
							>
								Print Ticket
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</>
	)
}
