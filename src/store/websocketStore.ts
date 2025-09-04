import { create } from 'zustand'
import { WsMessage } from '@/types'

interface WebSocketState {
	connection: WebSocket | null
	isConnected: boolean
	messages: WsMessage[]
	connect: () => void
	disconnect: () => void
	subscribe: (gateId: string) => void
	unsubscribe: (gateId: string) => void
	retryCount: number
	retryInterval: number
	retryConnection: () => void
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
	connection: null,
	isConnected: false,
	messages: [],
	retryCount: 0,
	retryInterval: 5000,
	retryConnection: () => {
		const { retryCount } = get()
		if (retryCount < 5) {
			// Max 5 retries
			setTimeout(() => {
				set({ retryCount: retryCount + 1 })
				get().connect()
			}, get().retryInterval)
		}
	},
	connect: () => {
		const ws = new WebSocket('ws://localhost:3000/api/v1/ws')

		ws.onopen = () => {
			set({ isConnected: true, connection: ws })
			console.log('WebSocket connected')
		}

		ws.onclose = () => {
			set({ isConnected: false, connection: null })
			console.log('WebSocket disconnected, attempting to reconnect...')
			get().retryConnection()
		}

		ws.onmessage = (event) => {
			const message: WsMessage = JSON.parse(event.data)
			set((state) => ({ messages: [...state.messages, message] }))
		}

		// Don't set connection here, wait for onopen
	},

	disconnect: () => {
		const { connection } = get()
		connection?.close()
		set({ connection: null, isConnected: false })
	},

	subscribe: (gateId: string) => {
		const { connection, isConnected } = get()
		if (isConnected && connection && connection.readyState === WebSocket.OPEN) {
			connection.send(
				JSON.stringify({ type: 'subscribe', payload: { gateId } }),
			)
		}
	},

	unsubscribe: (gateId: string) => {
		const { connection, isConnected } = get()
		if (isConnected && connection && connection.readyState === WebSocket.OPEN) {
			connection.send(
				JSON.stringify({ type: 'unsubscribe', payload: { gateId } }),
			)
		}
	},
}))
