'use client'
import { useEffect } from 'react'
import { useWebSocketStore } from '@/store/websocketStore'

export function WebSocketInitializer() {
	const connect = useWebSocketStore((state) => state.connect)

	useEffect(() => {
		connect()
	}, [connect])

	return null
}
