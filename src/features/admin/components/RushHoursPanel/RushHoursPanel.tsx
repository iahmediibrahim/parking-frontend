'use client'

import { RushHour } from '@/core'
import { PrimaryButton } from '@/shared'
import * as motion from 'motion/react-client'
import React, { useState } from 'react'
import { useCreateRushHour, useRushHours } from '../../hooks'

export function RushHoursPanel() {
	const { mutate: createRushHour } = useCreateRushHour()
	const cachedRushHours = useRushHours()
	const [newRushHour, setNewRushHour] = useState({
		weekDay: 0,
		from: '07:00',
		to: '09:00',
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		createRushHour(newRushHour, {
			onSuccess: () => {
				setNewRushHour({ weekDay: 0, from: '07:00', to: '09:00' })
			},
		})
	}

	const weekDays = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	]

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h3 className="text-2xl font-semibold text-gray-800">Rush Hours</h3>
			</div>

			<form
				onSubmit={handleSubmit}
				className="bg-white rounded-xl shadow-sm p-6"
			>
				<h4 className="text-lg font-medium text-gray-800 mb-4">
					Add New Rush Hour
				</h4>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-600 mb-2">
							Day of Week
						</label>
						<select
							value={newRushHour.weekDay}
							onChange={(e) =>
								setNewRushHour({
									...newRushHour,
									weekDay: parseInt(e.target.value),
								})
							}
							className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
						>
							{weekDays.map((day, index) => (
								<option key={index} value={index}>
									{day}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-600 mb-2">
							From
						</label>
						<input
							type="time"
							value={newRushHour.from}
							onChange={(e) =>
								setNewRushHour({ ...newRushHour, from: e.target.value })
							}
							className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-600 mb-2">
							To
						</label>
						<input
							type="time"
							value={newRushHour.to}
							onChange={(e) =>
								setNewRushHour({ ...newRushHour, to: e.target.value })
							}
							className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
						/>
					</div>
					<div className="flex items-end">
						<PrimaryButton
							type="submit"
 						>
							Add Rush Hour
						</PrimaryButton>
					</div>
				</div>
			</form>

			<div className="bg-white rounded-xl shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-100">
								<th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
									Day
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
							{cachedRushHours.length > 0 ? (
								cachedRushHours.map((rushHour: RushHour) => (
									<motion.tr
										key={rushHour.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
									>
										<td className="py-4 px-6 text-sm text-gray-800">
											{weekDays[rushHour.weekDay]}
										</td>
										<td className="py-4 px-6 text-sm text-gray-600">
											{rushHour.from}
										</td>
										<td className="py-4 px-6 text-sm text-gray-600">
											{rushHour.to}
										</td>
									</motion.tr>
								))
							) : (
								<tr>
									<td colSpan={3} className="py-8 text-center text-gray-500">
										No rush hours configured yet
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
