'use client'
import React from 'react'
import { useAuthStore } from '@/store/authStore'
import { Tabs } from '@/components'

export default function AdminDashboard() {
	const { user } = useAuthStore()

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

	const tabs = [
		{
			id: 'parking-state',
			label: 'Parking State',
			// content: <ParkingStateReport />,
		},
		{
			id: 'categories',
			label: 'Categories',
			// content: <CategoryManagement />,
		},
		{
			id: 'zones',
			label: 'Zones',
			// content: <ZoneManagement />,
		},
		{
			id: 'rush-hours',
			label: 'Rush Hours',
			// content: <RushHourManagement />,
		},
		{
			id: 'vacations',
			label: 'Vacations',
			// content: <VacationManagement />,
		},
	]

	return (
		<div className="bg-white rounded-lg shadow-md p-6 mt-20">
			<h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
			<Tabs tabs={tabs} defaultTab="parking-state" />
		</div>
	)
}
