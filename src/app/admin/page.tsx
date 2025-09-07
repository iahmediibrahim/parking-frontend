'use client'
import {
	AdminUpdateTester,
	AuditLogTab,
	ControlPanelTab,
	EmployeesTab,
	ParkingStateTab,
	useAdminWebSocket,
	useAuthStore,
} from '@/features'
import { Tabs } from '@/shared'

export default function AdminDashboard() {
	const {} = useAdminWebSocket()
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
			<Tabs tabs={tabs} defaultTab="employees" />
			<AdminUpdateTester />
		</div>
	)
}
