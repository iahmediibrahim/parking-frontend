'use client'

import { Vacation } from '@/core'
import * as motion from 'motion/react-client'
import React, { useState } from 'react'
import { useCreateVacation, useVacations } from '../../hooks'

export function VacationsPanel() {
	const { mutate: createVacation } = useCreateVacation()
	const vacations = useVacations()

	const [newVacation, setNewVacation] = useState({
		name: '',
		from: '',
		to: '',
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		createVacation(newVacation, {
			onSuccess: () => {
				setNewVacation({ name: '', from: '', to: '' })
			},
		})
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h3 className="text-2xl font-semibold text-gray-800">Vacations</h3>
			</div>

			<form
				onSubmit={handleSubmit}
				className="bg-white rounded-xl shadow-sm p-6"
			>
				<h4 className="text-lg font-medium text-gray-800 mb-4">
					Add New Vacation
				</h4>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-600 mb-2">
							Name
						</label>
						<input
							type="text"
							value={newVacation.name}
							onChange={(e) =>
								setNewVacation({ ...newVacation, name: e.target.value })
							}
							className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-600 mb-2">
							From
						</label>
						<input
							type="date"
							value={newVacation.from}
							onChange={(e) =>
								setNewVacation({ ...newVacation, from: e.target.value })
							}
							className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-600 mb-2">
							To
						</label>
						<input
							type="date"
							value={newVacation.to}
							onChange={(e) =>
								setNewVacation({ ...newVacation, to: e.target.value })
							}
							className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
							required
						/>
					</div>
					<div className="flex items-end">
						<button
							type="submit"
							className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
						>
							Add Vacation
						</button>
					</div>
				</div>
			</form>

			<div className="bg-white rounded-xl shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-100">
								<th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
									Name
								</th>
								<th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
									From
								</th>
								<th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
									To
								</th>
							</tr>
						</thead>
						<tbody>
							{vacations.length > 0 ? (
								vacations.map((vacation: Vacation) => (
									<motion.tr
										key={vacation.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
									>
										<td className="py-4 px-6 text-sm text-gray-800">
											{vacation.name}
										</td>
										<td className="py-4 px-6 text-sm text-gray-600">
											{vacation.from}
										</td>
										<td className="py-4 px-6 text-sm text-gray-600">
											{vacation.to}
										</td>
									</motion.tr>
								))
							) : (
								<tr>
									<td colSpan={3} className="py-8 text-center text-gray-500">
										No vacations configured yet
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
