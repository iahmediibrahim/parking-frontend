import { api, LoginResponse } from '@/core'
import { useAuthStore } from '@/features'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

// Custom hook for handling login logic
export const useLogin = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const { user, login } = useAuthStore()
	const router = useRouter()

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
			const response: LoginResponse = await api.login(username, password)
			if (response.user && response.token) {
				login(response.user, response.token)
				router.push(response.user.role === 'admin' ? '/admin' : '/checkpoint')
			} else {
				setError('Invalid credentials')
			}
		} catch (err) {
			setError(
				`Login failed. Please try again. ${
					err instanceof Error ? err.message : 'Unknown error occurred'
				}`,
			)
		} finally {
			setIsLoading(false)
		}
	}

	return {
		username,
		setUsername,
		password,
		setPassword,
		error,
		isLoading,
		user,
		handleSubmit,
	}
}
