'use client'

import { useWebSocketStore } from '@/core'
import { useState } from 'react'

export function AdminUpdateTester() {
	const [showTester, setShowTester] = useState(false)
	const [actionType, setActionType] = useState('category-rates-changed')
	const [targetType, setTargetType] = useState('category')
	const [targetId, setTargetId] = useState('cat_premium')
	const {
		isConnected,
		messages,
		adminUpdates,
		connectionHistory,
		debugMode,
		setDebugMode,
		clearAdminUpdates,
		testBackendAdminUpdates,
		connection,
	} = useWebSocketStore()

	const [showDebug, setShowDebug] = useState(false)
	const [filter, setFilter] = useState('all')

	const filteredHistory = connectionHistory.filter((item) => {
		if (filter === 'all') return true
		return item.event.toLowerCase().includes(filter.toLowerCase())
	})

	const simulateAdminUpdate = () => {
		if (!isConnected || !connection) {
			alert('WebSocket not connected')
			return
		}

		const mockAdminUpdate = {
			type: 'admin-update',
			payload: {
				adminId: 'admin_1',
				action: actionType,
				targetType: targetType,
				targetId: targetId,
				details: { some: 'data' },
				timestamp: new Date().toISOString(),
			},
		}

		const event = new MessageEvent('message', {
			data: JSON.stringify(mockAdminUpdate),
		})

		connection.onmessage?.(event)
	}

	return (
		<>
			<div className="fixed bottom-4 right-4 z-50">
				<button
					onClick={() => setShowTester(!showTester)}
					className="p-2 bg-blue-600 text-white rounded-lg shadow-md"
				>
					{showTester ? 'Hide Tester' : 'Test Admin Updates'}
				</button>

				{showTester && (
					<div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-md">
						<h3 className="font-bold mb-2">Simulate Admin Update</h3>

						<div className="space-y-2 mb-3">
							<div>
								<label className="block text-sm font-medium">Action Type</label>
								<select
									value={actionType}
									onChange={(e) => setActionType(e.target.value)}
									className="w-full p-1 border rounded"
								>
									<option value="category-rates-changed">
										Category Rates Changed
									</option>
									<option value="zone-closed">Zone Closed</option>
									<option value="zone-opened">Zone Opened</option>
									<option value="vacation-added">Vacation Added</option>
									<option value="rush-updated">Rush Updated</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium">Target Type</label>
								<select
									value={targetType}
									onChange={(e) => setTargetType(e.target.value)}
									className="w-full p-1 border rounded"
								>
									<option value="category">Category</option>
									<option value="zone">Zone</option>
									<option value="vacation">Vacation</option>
									<option value="rush">Rush</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium">Target ID</label>
								<input
									type="text"
									value={targetId}
									onChange={(e) => setTargetId(e.target.value)}
									className="w-full p-1 border rounded"
								/>
							</div>
						</div>

						<button
							onClick={simulateAdminUpdate}
							className="w-full bg-green-600 text-white py-1 rounded"
						>
							Simulate Admin Update
						</button>
					</div>
				)}
			</div>

			<div className="fixed bottom-4 left-4 z-50">
				<button
					onClick={() => setShowDebug(!showDebug)}
					className="p-2 bg-gray-800 text-white rounded-lg shadow-md"
				>
					{showDebug ? 'Hide Debug' : 'Show Debug'}
				</button>

				{showDebug && (
					<div className="mt-2 p-4 bg-gray-900 text-white rounded-lg shadow-md max-w-md max-h-96 overflow-auto">
						<div className="flex justify-between items-center mb-4">
							<h3 className="font-bold">WebSocket Debug</h3>
							<div className="flex items-center space-x-2">
								<span
									className={`w-3 h-3 rounded-full ${
										isConnected ? 'bg-green-500' : 'bg-red-500'
									}`}
								/>
								<span>{isConnected ? 'Connected' : 'Disconnected'}</span>
								<label className="flex items-center">
									<input
										type="checkbox"
										checked={debugMode}
										onChange={(e) => setDebugMode(e.target.checked)}
										className="mr-1"
									/>
									Debug
								</label>
							</div>
						</div>

						<div className="mb-4">
							<div className="flex justify-between mb-2">
								<span>Messages: {messages.length}</span>
								<span>Admin Updates: {adminUpdates.length}</span>
							</div>
							<div className="flex space-x-2">
								<button
									onClick={clearAdminUpdates}
									className="text-xs bg-red-600 px-2 py-1 rounded"
								>
									Clear Admin Updates
								</button>
								<button
									onClick={testBackendAdminUpdates}
									className="text-xs bg-blue-600 px-2 py-1 rounded"
								>
									Test Backend
								</button>
							</div>
						</div>

						<div className="mb-2">
							<select
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
								className="w-full p-1 bg-gray-800 rounded"
							>
								<option value="all">All Events</option>
								<option value="message">Messages</option>
								<option value="connection">Connection</option>
								<option value="subscription">Subscriptions</option>
								<option value="error">Errors</option>
							</select>
						</div>

						<div className="text-xs">
							<h4 className="font-semibold mb-1">Connection History:</h4>
							<div className="space-y-1">
								{filteredHistory.slice(-10).map((item, index) => (
									<div key={index} className="border-b border-gray-700 pb-1">
										<div className="text-gray-400">
											{item.timestamp.toLocaleTimeString()}
										</div>
										<div className="font-medium">{item.event}</div>
										{typeof item.details === 'string' && (
											<div className="text-gray-300 truncate">
												{JSON.stringify(item.details)}
											</div>
										)}
									</div>
								))}
							</div>
						</div>

						<div className="mt-4">
							<h4 className="font-semibold mb-1">Recent Admin Updates:</h4>
							<div className="space-y-1">
								{adminUpdates.slice(-5).map((update, index) => (
									<div key={index} className="border-b border-gray-700 pb-1">
										<div className="text-gray-400">
											{new Date(update.timestamp).toLocaleTimeString()}
										</div>
										<div className="font-medium">{update.action}</div>
										<div className="text-gray-300">
											{update.targetType}: {update.targetId}
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="mt-4">
							<h4 className="font-semibold mb-1">
								Recent Messages (all types):
							</h4>
							<div className="space-y-1">
								{messages.slice(-5).map((message, index) => (
									<div key={index} className="border-b border-gray-700 pb-1">
										<div className="text-gray-400">
											{new Date().toLocaleTimeString()}
										</div>
										<div className="font-medium">{message.type}</div>
										<div className="text-gray-300 truncate">
											{JSON.stringify(message.payload)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	)
}
