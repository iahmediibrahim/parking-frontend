'use client'
import React, { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/services/api'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const { login } = useAuthStore()
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		try {
			const response = await api.login(username, password)
			if (response.user && response.token) {
				login(response.user, response.token)
				router.push(response.user.role === 'admin' ? '/admin' : '/checkpoint')
			} else {
				setError('Invalid credentials')
			}
		} catch (err) {
			setError('Login failed. Please try again.')
		}
	}

	return (
		<div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-20">
			<h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="username"
					>
						Username
					</label>
					<input
						id="username"
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div className="mb-6">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="password"
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<button
					type="submit"
					className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					Sign In
				</button>
			</form>

			<div className="mt-6 text-sm text-gray-600">
				<p className="font-bold">Demo credentials:</p>
				<p>Admin: username: admin, password: adminpass</p>
				<p>Employee: username: emp1, password: pass1</p>
			</div>
		</div>
	)
}
