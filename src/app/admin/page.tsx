'use client'
import React, { useState } from 'react'
import { useAuthStore } from '@/store/authStore'

export default function AdminDashboard() {
	const { user } = useAuthStore()
	const [activeTab, setActiveTab] = useState('parking-state')

	// Redirect if not admin
	if (user?.role !== 'admin') {
		return (
			<div className="bg-white rounded-lg shadow-md p-6 text-center mt-20">
				<h2 className="text-xl font-bold text-red-600">Access Denied</h2>
				<p className="mt-2">
					You need to be an administrator to access this page.
				</p>
			</div>
		)
	}

	return (
		<div className="bg-white rounded-lg shadow-md p-6 mt-20">
			<h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

			<div className="flex border-b mb-6 overflow-x-auto">
				{[
					{ id: 'parking-state', label: 'Parking State' },
					{ id: 'categories', label: 'Categories' },
					{ id: 'zones', label: 'Zones' },
					{ id: 'rush-hours', label: 'Rush Hours' },
					{ id: 'vacations', label: 'Vacations' },
				].map((tab) => (
					<button
						key={tab.id}
						className={`py-2 px-4 font-medium whitespace-nowrap ${
							activeTab === tab.id
								? 'border-b-2 border-blue-500 text-blue-600'
								: 'text-gray-500'
						}`}
						onClick={() => setActiveTab(tab.id)}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className="mt-4"></div>
		</div>
	)
}
