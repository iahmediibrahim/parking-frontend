import { useEffect } from 'react'
import { useWebSocketStore } from '@/store/websocketStore'

export const useWebSocket = (subscriptionId?: string) => {
	const { isConnected, connect, disconnect, subscribe, unsubscribe, messages } =
		useWebSocketStore()

	useEffect(function handleConnection() {
		if (!isConnected) {
			connect()
		}
		return function cleanup() {
			disconnect()
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(
		function handleSubscription() {
			if (subscriptionId && isConnected) {
				subscribe(subscriptionId)
				return function cleanup() {
					unsubscribe(subscriptionId)
				}
			}
		},
		[subscriptionId, isConnected, subscribe, unsubscribe],
	)

	return { isConnected, messages }
}
