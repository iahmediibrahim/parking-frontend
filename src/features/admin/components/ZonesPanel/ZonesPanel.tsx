'use client'

import { formatCategoryName, Zone } from '@/core'
import { useUpdateZone, useZones } from '@/shared'
import * as motion from 'motion/react-client'

export function ZonesPanel() {
	const { data: zones, isLoading, error } = useZones()
	const { mutate: updateZone } = useUpdateZone()

	const handleToggleZone = (id: string, currentStatus: boolean) => {
		updateZone({ id, open: !currentStatus })
	}

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[200px]">
				<div className="w-8 h-8 border-t-2 border-red-500 rounded-full animate-spin"></div>
				<p className="mt-4 text-gray-600">Loading zones...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className="p-4 bg-red-50 rounded-lg text-red-600 flex items-center">
				<svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
					<path
						fillRule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
						clipRule="evenodd"
					/>
				</svg>
				{error.message}
			</div>
		)
	}

	return (
		<div className="p-6">
			<h3 className="text-2xl font-semibold mb-6 text-gray-800">
				Manage Zones
			</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{zones?.map((zone: Zone) => (
					<motion.div
						key={zone.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
					>
						<div className="mb-4">
							<h4 className="text-lg font-medium text-gray-900">{zone.name}</h4>
						</div>
						<div className="space-y-2">
							<div className="flex items-center text-gray-600">
								<span className="text-sm">Category:</span>
								<span className="ml-2 px-2 py-1 bg-gray-100 rounded-md text-sm">
									{formatCategoryName(zone.categoryId)}
								</span>
							</div>
							<div className="flex items-center">
								<span className="text-sm text-gray-600">Status:</span>
								<span
									className={`ml-2 px-2 py-1 rounded-md text-sm ${
										zone.open
											? 'bg-green-50 text-green-600'
											: 'bg-red-50 text-red-600'
									}`}
								>
									{zone.open ? 'Open' : 'Closed'}
								</span>
							</div>
							<div className="flex items-center">
								<span className="text-sm text-gray-600">Availability:</span>
								<div className="ml-2 flex items-center">
									<span className="text-sm font-medium">{zone.free}</span>
									<span className="mx-1 text-gray-400">/</span>
									<span className="text-sm text-gray-600">
										{zone.totalSlots}
									</span>
								</div>
							</div>
						</div>
						<div className="flex w-full mt-4">
							<button
								onClick={() => handleToggleZone(zone.id, zone.open)}
								className={`w-full px-4 py-2 rounded-lg transition-colors cursor-pointer ${
									zone.open
										? 'bg-red-50 text-red-600 hover:bg-red-100'
										: 'bg-green-50 text-green-600 hover:bg-green-100'
								}`}
							>
								{zone.open ? 'Close' : 'Open'}
							</button>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	)
}
