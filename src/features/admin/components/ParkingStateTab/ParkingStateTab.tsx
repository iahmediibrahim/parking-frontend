'use client'

import { Zone } from '@/core'
import * as motion from 'motion/react-client'
import { useParkingState } from '../../hooks'

export function ParkingStateTab() {
	const { data: parkingState, isLoading, error } = useParkingState()

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="space-y-3">
					<div className="w-10 h-10 border-t-4 border-red-500 rounded-full animate-spin"></div>
					<p className="text-gray-500">Loading parking state...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="bg-red-50 p-4 rounded-lg shadow-sm">
				<p className="text-red-600">
					Error loading parking state: {error.message}
				</p>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h3 className="text-2xl font-semibold text-gray-800">
					Parking Overview
				</h3>
			</div>
			<div className="bg-white rounded-xl shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-100">
								<th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
									Zone
								</th>
								<th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
									Status
								</th>
								<th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
									Total Slots
								</th>
								<th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
									Occupied
								</th>
								<th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
									Available
								</th>
								<th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
									Reserved
								</th>
								<th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
									Visitors
								</th>
								<th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
									Subscribers
								</th>
							</tr>
						</thead>
						<tbody>
							{parkingState?.map((zone: Zone) => (
								<motion.tr
									key={zone.id + zone.name}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
								>
									<td className="py-4 px-6 text-sm text-gray-800">
										{zone.name}
									</td>
									<td className="py-4 px-6 text-sm">
										<span
											className={`px-3 py-1 rounded-full text-sm ${
												zone.open
													? 'bg-green-100 text-green-700'
													: 'bg-red-100 text-red-700'
											}`}
										>
											{zone.open ? 'Open' : 'Closed'}
										</span>
									</td>
									<td className="py-4 px-6 text-sm text-gray-800">
										{zone.totalSlots}
									</td>
									<td className="py-4 px-6 text-sm text-gray-800">
										{zone.occupied}
									</td>
									<td className="py-4 px-6 text-sm text-gray-800">
										{zone.free}
									</td>
									<td className="py-4 px-6 text-sm text-gray-800">
										{zone.reserved}
									</td>
									<td className="py-4 px-6 text-sm text-gray-800">
										{zone.availableForVisitors}
									</td>
									<td className="py-4 px-6 text-sm text-gray-800">
										{zone.availableForSubscribers}
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
