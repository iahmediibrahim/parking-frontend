'use client'

import { Category } from '@/core'
import * as motion from 'motion/react-client'
import { useState } from 'react'
import { useCategories, useUpdateCategoryRates } from '../../hooks'

export function CategoriesPanel() {
	const { data: categories, isLoading, error } = useCategories()
	const { mutate: updateCategoryRates } = useUpdateCategoryRates()

	const [editingCategory, setEditingCategory] = useState<string | null>(null)
	const [rateNormal, setRateNormal] = useState(0)
	const [rateSpecial, setRateSpecial] = useState(0)

	const handleEdit = (category: Category) => {
		setEditingCategory(category.id)
		setRateNormal(category.rateNormal)
		setRateSpecial(category.rateSpecial)
	}

	const handleSave = (id: string) => {
		updateCategoryRates({ id, rateNormal, rateSpecial })
		setEditingCategory(null)
	}

	const handleCancel = () => {
		setEditingCategory(null)
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="space-y-3">
					<div className="w-10 h-10 border-t-4 border-red-500 rounded-full animate-spin"></div>
					<p className="text-gray-500">Loading categories...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="bg-red-50 p-4 rounded-lg shadow-sm">
				<p className="text-red-600">
					Error loading categories: {error.message}
				</p>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h3 className="text-2xl font-semibold text-gray-800">Categories</h3>
			</div>
			<div className="bg-white rounded-xl shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-100">
								<th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
									Name
								</th>
								<th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
									Description
								</th>
								<th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
									Normal Rate
								</th>
								<th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
									Special Rate
								</th>
								<th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{categories?.map((category: Category) => (
								<motion.tr
									key={category.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
								>
									<td className="py-4 px-6 text-sm text-gray-800">
										{category.name}
									</td>
									<td className="py-4 px-6 text-sm text-gray-600">
										{category.description}
									</td>
									<td className="py-4 px-6">
										{editingCategory === category.id ? (
											<input
												type="number"
												step="0.01"
												value={rateNormal}
												onChange={(e) =>
													setRateNormal(parseFloat(e.target.value))
												}
												className="w-24 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
											/>
										) : (
											<span className="text-sm font-medium">
												${category.rateNormal}
											</span>
										)}
									</td>
									<td className="py-4 px-6">
										{editingCategory === category.id ? (
											<input
												type="number"
												step="0.01"
												value={rateSpecial}
												onChange={(e) =>
													setRateSpecial(parseFloat(e.target.value))
												}
												className="w-24 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
											/>
										) : (
											<span className="text-sm font-medium">
												${category.rateSpecial}
											</span>
										)}
									</td>
									<td className="py-4 px-6">
										{editingCategory === category.id ? (
											<div className="flex space-x-2">
												<button
													onClick={() => handleSave(category.id)}
													className="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
												>
													Save
												</button>
												<button
													onClick={handleCancel}
													className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
												>
													Cancel
												</button>
											</div>
										) : (
											<button
												onClick={() => handleEdit(category)}
												className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
											>
												Edit
											</button>
										)}
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
