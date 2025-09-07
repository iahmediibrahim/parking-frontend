'use client'

import { AdminUpdateMessage, useWebSocketStore } from '@/core'
import * as motion from 'motion/react-client'
import { useEffect, useState } from 'react'

export function AuditLogTab() {
	const { adminUpdates, isConnected } = useWebSocketStore()
	console.log('adminUpdatesadminUpdates', adminUpdates)
	const [filteredUpdates, setFilteredUpdates] = useState<AdminUpdateMessage[]>(
		[],
	)
	const [filter, setFilter] = useState<string>('all')

	// Apply filters when adminUpdates or filter changes
	useEffect(() => {
		let updates = [...adminUpdates].reverse() // Show newest first

		if (filter !== 'all') {
			updates = updates.filter((update) => update.action === filter)
		}

		setFilteredUpdates(updates)
	}, [adminUpdates, filter])

	const getActionColor = (action: string) => {
		switch (action) {
			case 'category-rates-changed':
				return 'bg-purple-100 text-purple-800'
			case 'zone-closed':
				return 'bg-red-100 text-red-800'
			case 'zone-opened':
				return 'bg-green-100 text-green-800'
			case 'vacation-added':
				return 'bg-blue-100 text-blue-800'
			case 'rush-updated':
				return 'bg-yellow-100 text-yellow-800'
			default:
				return 'bg-gray-100 text-gray-800'
		}
	}

	const formatDetails = (
		details: Record<string, unknown> | string | null | undefined,
	) => {
		if (!details) return '-'

		if (typeof details === 'object') {
			return Object.entries(details)
				.map(([key, value]) => `${key}: ${value}`)
				.join(', ')
		}

		return String(details)
	}

	return (
		<div>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold">Audit Log</h2>

				<div className="flex items-center space-x-2">
					<span
						className={`w-3 h-3 rounded-full ${
							isConnected ? 'bg-green-500' : 'bg-red-500'
						}`}
					/>
					<span className="text-sm text-gray-500">
						{isConnected ? 'Connected' : 'Disconnected'}
					</span>

					<select
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
						className="ml-4 px-3 py-1 border border-gray-300 rounded text-sm"
					>
						<option value="all">All Actions</option>
						<option value="category-rates-changed">Rate Changes</option>
						<option value="zone-closed">Zone Closed</option>
						<option value="zone-opened">Zone Opened</option>
						<option value="vacation-added">Vacation Added</option>
						<option value="rush-updated">Rush Hours Updated</option>
					</select>

					{adminUpdates.length > 0 && (
						<button
							onClick={() => useWebSocketStore.getState().clearAdminUpdates()}
							className="ml-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
						>
							Clear Log
						</button>
					)}
				</div>
			</div>

			{filteredUpdates.length > 0 ? (
				<div className="overflow-x-auto rounded-lg border border-gray-200">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Timestamp
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Admin
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Action
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Target
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Details
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredUpdates.map((log, index) => (
								<motion.tr
									key={`${log.timestamp}-${index}`}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.2 }}
									className="hover:bg-gray-50"
								>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{new Date(log.timestamp).toLocaleString()}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{log.adminId}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(
												log.action,
											)}`}
										>
											{log.action.replace(/-/g, ' ')}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{log.targetType}: {log.targetId}
									</td>
									<td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
										{formatDetails(log.details)}
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div className="text-center py-12 bg-gray-50 rounded-lg">
					<p className="text-gray-500">
						{adminUpdates.length === 0
							? 'No admin actions recorded yet.'
							: `No actions match the "${filter}" filter.`}
					</p>
				</div>
			)}

			{filteredUpdates.length > 0 && (
				<div className="mt-4 text-sm text-gray-500">
					Showing {filteredUpdates.length} of {adminUpdates.length} total
					actions
				</div>
			)}
		</div>
	)
}
