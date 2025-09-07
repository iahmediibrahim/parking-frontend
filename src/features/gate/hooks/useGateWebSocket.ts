import { useWebSocketStore } from '@/core'
import { useEffect } from 'react'

export const useGateWebSocket = (gateId?: string) => {
	const { isConnected, connect, subscribe, unsubscribe, messages } =
		useWebSocketStore()

	useEffect(() => {
		connect()

		return () => {
			// Don't disconnect completely as admin might need the connection
			// Just unsubscribe from this specific gate
			if (gateId) {
				unsubscribe(gateId)
			}
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (gateId && isConnected) {
			subscribe(gateId)
			return () => {
				unsubscribe(gateId)
			}
		}
	}, [gateId, isConnected, subscribe, unsubscribe])

	return { isConnected, messages }
}
