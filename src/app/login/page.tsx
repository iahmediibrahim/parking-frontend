'use client'
import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/services/api'
import { useRouter } from 'next/navigation'
import { Loader, PrimaryButton } from '@/components'

const Login: React.FC = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const { user, login } = useAuthStore()
	const router = useRouter()

	// Redirect if already logged in
	useEffect(() => {
		if (user) {
			router.push(user.role === 'admin' ? '/admin' : '/checkpoint')
		}
	}, [user, router])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setIsLoading(true)

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
		} finally {
			setIsLoading(false)
		}
	}

	if (user) return <Loader />

	return (
		<div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-20 border border-gray-100">
			<h1 className="text-2xl font-bold mb-6 text-center text-[#ef4937]">
				Login
			</h1>

			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-medium mb-2"
						htmlFor="username"
					>
						Username
					</label>
					<input
						id="username"
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4937] focus:border-transparent"
						required
						disabled={isLoading}
					/>
				</div>

				<div className="mb-6">
					<label
						className="block text-gray-700 text-sm font-medium mb-2"
						htmlFor="password"
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4937] focus:border-transparent"
						required
						disabled={isLoading}
					/>
				</div>
				<div className="flex justify-center">
					<PrimaryButton type="submit" disabled={isLoading}>
						{isLoading ? 'Signing in...' : 'Sign In'}
					</PrimaryButton>
				</div>
			</form>

			<div className="mt-6 text-sm text-gray-600">
				<p className="font-bold">Demo credentials:</p>
				<p>Admin: username: admin, password: adminpass</p>
				<p>Employee: username: emp1, password: pass1</p>
			</div>
		</div>
	)
}

export default Login
