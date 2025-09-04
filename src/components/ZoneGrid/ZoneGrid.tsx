import { Zone, WsMessage } from '@/types'
import * as motion from 'motion/react-client'
import { useWebSocketStore } from '@/store/websocketStore'
import { useMemo } from 'react'
import { formatCategoryName } from '@/helpers'

interface ZoneGridProps {
	zones: Zone[]
	selectedZone: string | null
	setSelectedZone: (id: string | null) => void
	type: 'visitor' | 'subscriber'
}

export function ZoneGrid({
	zones,
	selectedZone,
	setSelectedZone,
	type,
}: ZoneGridProps) {
	const { messages } = useWebSocketStore()
	console.log('messages', messages)
	// Check for special rate active status from WebSocket messages
	const specialActiveZones = useMemo(() => {
		const activeZones = new Set<string>()

		// Process messages to find zones with special rates active
		messages.forEach((message) => {
			if (message.type === 'zone-update' && message.payload) {
				// Check if the message payload has specialActive property
				if (message.payload.specialActive && message.payload.zoneId) {
					activeZones.add(message.payload.zoneId)
				}

				// If the payload is an array of zones, check each one
				if (Array.isArray(message.payload)) {
					message.payload.forEach((zone) => {
						if (zone.specialActive && zone.id) {
							activeZones.add(zone.id)
						}
					})
				}
			}
		})

		return activeZones
	}, [messages])

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
			{zones?.map((zone: Zone) => {
				// Check if this zone has special rate active
				const isSpecialActive = specialActiveZones.has(zone.id)

				return (
					<motion.div
						key={zone.id}
						className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl ${
							selectedZone === zone.id ? 'ring-2 ring-red-500' : ''
						} ${
							!zone.open ||
							(type === 'visitor' && zone.availableForVisitors <= 0)
								? 'opacity-50 cursor-not-allowed'
								: ''
						}`}
						onClick={() => {
							if (
								zone.open &&
								(type !== 'visitor' || zone.availableForVisitors > 0)
							) {
								setSelectedZone(zone.id)
							}
						}}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<div className="flex justify-between items-start">
							<div>
								<h3 className="font-bold text-xl text-gray-800">{zone.name}</h3>
								{zone.categoryId && (
									<span className="text-sm text-gray-500 mt-1">
										{formatCategoryName(zone.categoryId)}
									</span>
								)}
							</div>
							<div className="flex flex-col items-end gap-2">
								<span
									className={`px-3 py-1 rounded-full text-sm font-medium ${
										zone.open
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'
									}`}
								>
									{zone.open ? 'Open' : 'Closed'}
								</span>

								{/* Special Rate Indicator */}
								{isSpecialActive && (
									<span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 animate-pulse">
										Special Rate Active
									</span>
								)}
							</div>
						</div>

						<div className="mt-4 space-y-3">
							<div className="bg-gray-50 rounded-lg p-3">
								<div className="flex justify-between items-center">
									<span className="text-gray-600">Availability</span>
									<span className="font-semibold">
										{zone.free} / {zone.totalSlots}
									</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2 mt-2">
									<div
										className="bg-blue-500 h-2 rounded-full"
										style={{
											width: `${(zone.free / zone.totalSlots) * 100}%`,
										}}
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div className="bg-gray-50 rounded-lg p-3">
									<span className="text-gray-600 text-sm">Reserved</span>
									<p className="font-semibold text-lg">{zone.reserved}</p>
								</div>
								<div className="bg-gray-50 rounded-lg p-3">
									<span className="text-gray-600 text-sm">
										{type === 'visitor' ? 'Visitor Spots' : 'Subscriber Spots'}
									</span>
									<p className="font-semibold text-lg">
										{type === 'visitor'
											? zone.availableForVisitors
											: zone.availableForSubscribers}
									</p>
								</div>
							</div>

							<div className="border-t pt-3">
								<div className="flex justify-between items-center">
									<div>
										<span className="text-gray-600 text-sm">Normal Rate</span>
										<p className="font-semibold">${zone.rateNormal}</p>
									</div>
									<div className="text-right">
										<span
											className={`text-gray-600 text-sm ${
												isSpecialActive ? 'font-bold text-amber-700' : ''
											}`}
										>
											Special Rate
										</span>
										<p
											className={`font-semibold ${
												isSpecialActive ? 'text-amber-700' : ''
											}`}
										>
											${zone.rateSpecial}
										</p>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				)
			})}
		</div>
	)
}
