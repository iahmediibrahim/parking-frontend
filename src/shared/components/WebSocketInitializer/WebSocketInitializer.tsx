'use client'
import { useWebSocketStore } from '@/core'
import { useEffect } from 'react'

export function WebSocketInitializer() {
	const connect = useWebSocketStore((state) => state.connect)

	useEffect(() => {
		connect()
	}, [connect])

	return null
}
