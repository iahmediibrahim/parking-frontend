'use client'

import { User } from '@/core'
import { PrimaryButton } from '@/shared'
import * as motion from 'motion/react-client'
import React, { useState } from 'react'
import { useCreateEmployee, useEmployees } from '../../hooks'

export function EmployeesTab() {
  const { data: employees, isLoading, error } = useEmployees()
  const { mutate: createEmployee, isPending: isCreating, error: createError } = useCreateEmployee()

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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <p className="text-red-700">Failed to load employees. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-8">Employee Management</h2>

      {/* Add Employee Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold mb-6">Add New Employee</h3>
        
        {createError && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700 text-sm">Failed to create employee. {createError?.message}. Please try again.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={newEmployee.username}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, username: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={newEmployee.password}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
					<div className='flex justify-end'>
						<PrimaryButton
							type="submit"
							disabled={isCreating}
						>
							{isCreating ? 'Adding...' : 'Add Employee'}
						</PrimaryButton>
					</div>
        
        </form>
      </div>

      {/* Employees List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6">Employees List</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-4 text-left font-medium text-gray-600">Username</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">Role</th>
                <th className="py-3 px-4 text-left font-medium text-gray-600">ID</th>
              </tr>
            </thead>
            <tbody>
              {employees?.map((employee: User) => (
                <motion.tr
                  key={employee.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-50 last:border-0"
                >
                  <td className="py-3 px-4">{employee.username}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        employee.role === 'admin'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {employee.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
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
