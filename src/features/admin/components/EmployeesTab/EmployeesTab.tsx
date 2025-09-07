'use client'

import { User } from '@/core'
import * as motion from 'motion/react-client'
import React, { useState } from 'react'
import { useCreateEmployee, useEmployees } from '../../hooks'

export function EmployeesTab() {
	const { data: employees, isLoading, error } = useEmployees()
	const { mutate: createEmployee, isPending: isCreating } = useCreateEmployee()

	const [newEmployee, setNewEmployee] = useState({
		username: '',
		password: '',
		role: 'employee' as 'admin' | 'employee',
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		createEmployee(newEmployee, {
			onSuccess: () => {
				setNewEmployee({ username: '', password: '', role: 'employee' })
			},
		})
	}

	if (isLoading) {
		return (
			<div className="text-center py-4">
				<div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-red-600"></div>
				<p className="mt-2">Loading employees...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
				Error loading employees
			</div>
		)
	}

	return (
		<div>
			<h2 className="text-xl font-semibold mb-4">Employee Management</h2>

			{/* Add Employee Form */}
			<form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
				<h3 className="text-lg font-medium mb-3">Add New Employee</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Username
						</label>
						<input
							type="text"
							value={newEmployee.username}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, username: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Password
						</label>
						<input
							type="password"
							value={newEmployee.password}
							onChange={(e) =>
								setNewEmployee({ ...newEmployee, password: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Role
						</label>
						<select
							value={newEmployee.role}
							onChange={(e) =>
								setNewEmployee({
									...newEmployee,
									role: e.target.value as 'admin' | 'employee',
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md"
						>
							<option value="employee">Employee</option>
							<option value="admin">Admin</option>
						</select>
					</div>
				</div>
				<button
					type="submit"
					disabled={isCreating}
					className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
				>
					{isCreating ? 'Adding...' : 'Add Employee'}
				</button>
			</form>

			{/* Employees List */}
			<div>
				<h3 className="text-lg font-medium mb-3">Employees List</h3>
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white border border-gray-200">
						<thead>
							<tr className="bg-gray-100">
								<th className="py-2 px-4 border-b text-left">Username</th>
								<th className="py-2 px-4 border-b text-left">Role</th>
								<th className="py-2 px-4 border-b text-left">ID</th>
							</tr>
						</thead>
						<tbody>
							{employees?.map((employee: User) => (
								<motion.tr
									key={employee.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="hover:bg-gray-50"
								>
									<td className="py-2 px-4 border-b">{employee.username}</td>
									<td className="py-2 px-4 border-b">
										<span
											className={`px-2 py-1 rounded-full text-xs ${
												employee.role === 'admin'
													? 'bg-purple-100 text-purple-800'
													: 'bg-blue-100 text-blue-800'
											}`}
										>
											{employee.role}
										</span>
									</td>
									<td className="py-2 px-4 border-b text-sm text-gray-500">
										{employee.id}
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
