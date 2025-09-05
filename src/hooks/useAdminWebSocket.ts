// src/hooks/useAdminWebSocket.ts
import { useEffect } from 'react'
import { useWebSocketStore } from '@/store/websocketStore'

export const useAdminWebSocket = () => {
	const {
		subscribeToAdmin,
		unsubscribeFromAdmin,
		isConnected,
		connect,
		adminUpdates,
		addDebugMessage,
	} = useWebSocketStore()

	useEffect(() => {
		addDebugMessage('Admin WebSocket hook initialized')

		// Ensure WebSocket is connected
		if (!isConnected) {
			addDebugMessage('WebSocket not connected, attempting to connect...')
			connect()
		}

		// Subscribe to admin updates
		subscribeToAdmin()

		// Cleanup on unmount
		return () => {
			addDebugMessage(
				'Admin WebSocket hook cleanup - unsubscribing from admin updates',
			)
			unsubscribeFromAdmin()
		}
	}, [
		isConnected,
		connect,
		subscribeToAdmin,
		unsubscribeFromAdmin,
		addDebugMessage,
	])

	return { isConnected, adminUpdates }
}
