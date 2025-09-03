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
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
	connection: null,
	isConnected: false,
	messages: [],

	connect: () => {
		const ws = new WebSocket('ws://localhost:3000/api/v1/ws')

		ws.onopen = () => {
			set({ isConnected: true })
			console.log('WebSocket connected')
		}

		ws.onclose = () => {
			set({ isConnected: false })
			console.log('WebSocket disconnected')
		}

		ws.onmessage = (event) => {
			const message: WsMessage = JSON.parse(event.data)
			set((state) => ({ messages: [...state.messages, message] }))
		}

		set({ connection: ws })
	},

	disconnect: () => {
		const { connection } = get()
		connection?.close()
		set({ connection: null, isConnected: false })
	},

	subscribe: (gateId: string) => {
		const { connection, isConnected } = get()
		if (isConnected && connection) {
			connection.send(
				JSON.stringify({ type: 'subscribe', payload: { gateId } }),
			)
		}
	},

	unsubscribe: (gateId: string) => {
		const { connection, isConnected } = get()
		if (isConnected && connection) {
			connection.send(
				JSON.stringify({ type: 'unsubscribe', payload: { gateId } }),
			)
		}
	},
}))
