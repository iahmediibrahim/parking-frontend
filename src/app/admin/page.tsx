'use client'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useWebSocketStore } from '@/store/websocketStore'
import {
	AuditLogTab,
	ControlPanelTab,
	EmployeesTab,
	ParkingStateTab,
	Tabs,
} from '@/components'
import AdminUpdateTester from './AdminUpdateTester'
import { useAdminWebSocket } from '@/hooks/useAdminWebSocket'

export default function AdminDashboard() {
	const { isConnected, adminUpdates } = useAdminWebSocket()
	const { user } = useAuthStore()
	// Log connection status and admin updates
	useEffect(() => {
		console.log(
			`Admin WebSocket status: ${isConnected ? 'Connected' : 'Disconnected'}`,
		)
	}, [isConnected])

	useEffect(() => {
		if (adminUpdates.length > 0) {
			console.log('Admin updates received:', adminUpdates)
		}
	}, [adminUpdates])

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
			id: 'employees',
			label: 'Employees',
			content: <EmployeesTab />,
		},
		{
			id: 'parking-state',
			label: 'Parking State',
			content: <ParkingStateTab />,
		},
		{
			id: 'control-panel',
			label: 'Control Panel',
			content: <ControlPanelTab />,
		},
		{
			id: 'audit-log',
			label: 'Audit Log',
			content: <AuditLogTab />,
		},
	]

	return (
		<div className="bg-white rounded-lg shadow-md p-6 mt-20">
			<h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
			<Tabs tabs={tabs} defaultTab="control-panel" />
			<AdminUpdateTester />
		</div>
	)
}
