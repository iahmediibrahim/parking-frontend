'use client'
import { useAuthStore } from '@/features'
import { useEffect } from 'react'

export function AuthInitializer() {
	const initialize = useAuthStore((state) => state.initialize)

	useEffect(() => {
		initialize()
	}, [initialize])

	return null
}
