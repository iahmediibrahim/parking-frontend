'use client'

import { CheckpointClient, useAuthStore } from '@/features'

const Checkpoint = () => {
	const { user } = useAuthStore()

	if (user?.role !== 'employee') {
		return (
			<div className="bg-white rounded-xl shadow-lg p-8">
				<h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
				<p className="mt-2 text-gray-600">
					You need to be an employee to access this page.
				</p>
			</div>
		)
	}

	return <CheckpointClient />
}

export default Checkpoint
