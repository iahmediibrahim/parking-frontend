import { AdminUpdateMessage, WsMessage } from '@/core'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const HISTORY_LIMIT = 300
const MESSAGE_LIMIT = 500
const ADMIN_UPDATES_LIMIT = 500
const INITIAL_RETRY_INTERVAL = 1000
const MAX_RETRY_INTERVAL = 10_000

function clampArray<T>(arr: T[], limit: number): T[] {
	if (arr.length <= limit) return arr
	return arr.slice(arr.length - limit)
}

function resolveWebSocketURL(): string {
	const env = (
		typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_WS_URL : undefined
	) as string | undefined
	if (env && typeof env === 'string') return env

	if (typeof window !== 'undefined' && window.location) {
		const { protocol, host } = window.location
		const wsProtocol = protocol === 'https:' ? 'wss' : 'ws'
		return `${wsProtocol}://${host}/api/v1/ws`
	}

	return 'ws://localhost:3000/api/v1/ws'
}

type TimeoutId = ReturnType<typeof setTimeout> | null

interface WebSocketState {
	connection: WebSocket | null
	isConnected: boolean
	isConnecting: boolean
	intentionallyClosed: boolean

	messages: WsMessage[]
	adminUpdates: AdminUpdateMessage[]

	subscribedGates: string[]
	subscribedToAdmin: boolean

	debugMode: boolean
	connectionHistory: Array<{
		timestamp: Date
		event: string
		details?: unknown
	}>

	retryCount: number
	maxRetries: number
	retryInterval: number
	retryTimeoutId: TimeoutId

	connect: () => void
	disconnect: () => void
	subscribe: (gateId: string) => void
	unsubscribe: (gateId: string) => void
	subscribeToAdmin: () => void
	unsubscribeFromAdmin: () => void
	retryConnection: () => void
	clearAdminUpdates: () => void
	testBackendAdminUpdates: () => void

	setDebugMode: (debug: boolean) => void
	addDebugMessage: (message: string, details?: unknown) => void
}

export const useWebSocketStore = create<WebSocketState>()(
	persist(
		(set, get) => ({
			connection: null,
			isConnected: false,
			isConnecting: false,
			intentionallyClosed: false,

			messages: [],
			adminUpdates: [],

			subscribedGates: [],
			subscribedToAdmin: false,

			debugMode: true,
			connectionHistory: [],

			retryCount: 0,
			maxRetries: 10,
			retryInterval: INITIAL_RETRY_INTERVAL,
			retryTimeoutId: null,

			setDebugMode: (debug: boolean) => set({ debugMode: debug }),

			addDebugMessage: (message: string, details?: unknown) => {
				const { debugMode } = get()
				if (debugMode) {
					try {
						console.debug(`[WebSocket Debug] ${message}`, details ?? '')
					} catch {}
				}
				set((state) => ({
					connectionHistory: clampArray(
						[
							...state.connectionHistory,
							{
								timestamp: new Date(),
								event: message,
								details,
							},
						],
						HISTORY_LIMIT,
					),
				}))
			},

			retryConnection: () => {
				const {
					retryCount,
					maxRetries,
					retryInterval,
					retryTimeoutId,
					addDebugMessage,
					intentionallyClosed,
				} = get()

				if (intentionallyClosed) {
					addDebugMessage('Reconnect suppressed due to intentional close')
					return
				}

				if (retryCount >= maxRetries) {
					addDebugMessage('Max reconnection attempts reached')
					return
				}

				if (retryTimeoutId) clearTimeout(retryTimeoutId)

				const nextInterval = Math.min(
					retryInterval * 1.5 + Math.random() * 1000,
					MAX_RETRY_INTERVAL,
				)

				addDebugMessage(
					`Attempting to reconnect (${
						retryCount + 1
					}/${maxRetries}) in ${Math.round(retryInterval)}ms...`,
				)

				const id = setTimeout(() => {
					set({ retryCount: retryCount + 1, retryTimeoutId: null })
					get().connect()
				}, retryInterval)

				set({ retryInterval: nextInterval, retryTimeoutId: id })
			},

			connect: () => {
				const { connection, isConnected, isConnecting, addDebugMessage } = get()

				if (isConnected || isConnecting || connection) {
					addDebugMessage('Connect skipped: already connected/connecting')
					return
				}

				set({ isConnecting: true, intentionallyClosed: false })

				try {
					const url = resolveWebSocketURL()
					const ws = new WebSocket(url)
					addDebugMessage(`Creating new WebSocket connection to ${url}`)

					const thisSocket = ws
					const safeIsCurrent = () => get().connection === thisSocket

					ws.onopen = () => {
						if (!safeIsCurrent()) return

						addDebugMessage('WebSocket connection established')
						set({
							isConnected: true,
							isConnecting: false,
							retryCount: 0,
							retryInterval: INITIAL_RETRY_INTERVAL,
						})

						const { subscribedGates, subscribedToAdmin } = get()
						subscribedGates.forEach((gateId) => {
							try {
								thisSocket.send(
									JSON.stringify({ type: 'subscribe', payload: { gateId } }),
								)
								get().addDebugMessage(`Resubscribed to gate: ${gateId}`)
							} catch (e) {
								get().addDebugMessage('Failed to resubscribe to gate', {
									gateId,
									error: e,
								})
							}
						})

						if (subscribedToAdmin) {
							try {
								thisSocket.send(
									JSON.stringify({
										type: 'subscribe',
										payload: { gateId: 'admin' },
									}),
								)
								get().addDebugMessage('Resubscribed to admin updates')
							} catch (e) {
								get().addDebugMessage(
									'Failed to resubscribe to admin updates',
									e,
								)
							}
						}
					}

					ws.onclose = (event) => {
						if (!safeIsCurrent()) return

						addDebugMessage('WebSocket connection closed', {
							code: event.code,
							reason: event.reason,
						})

						set({ isConnected: false, isConnecting: false, connection: null })

						ws.onopen = ws.onmessage = ws.onerror = ws.onclose = null

						if (event.code !== 1000 && !get().intentionallyClosed) {
							addDebugMessage(
								'WebSocket disconnected unexpectedly, attempting to reconnect...',
							)
							get().retryConnection()
						} else {
							addDebugMessage('Normal/intentional close; no auto-reconnect')
						}
					}

					ws.onmessage = (event) => {
						if (!safeIsCurrent()) return

						try {
							const message: WsMessage = JSON.parse(event.data)
							get().addDebugMessage('Received WebSocket message', message)

							set((state) => ({
								messages: clampArray(
									[...state.messages, message],
									MESSAGE_LIMIT,
								),
							}))

							if (message.type === 'admin-update') {
								const adminUpdate = {
									...message.payload,
									receivedAt: new Date().toISOString(),
								}
								set((state) => ({
									adminUpdates: clampArray(
										state.adminUpdates.some(
											(update) =>
												update.timestamp ===
												(adminUpdate as unknown as AdminUpdateMessage)
													.timestamp,
										)
											? state.adminUpdates
											: [
													...state.adminUpdates,
													adminUpdate as unknown as AdminUpdateMessage,
											  ],
										ADMIN_UPDATES_LIMIT,
									),
								}))
								get().addDebugMessage('Admin update processed', adminUpdate)
							}
						} catch (error) {
							get().addDebugMessage('Error parsing WebSocket message', {
								error,
								data: event.data,
							})
						}
					}

					ws.onerror = (error) => {
						if (!safeIsCurrent()) return
						get().addDebugMessage('WebSocket error occurred', error)
					}

					const prev = get().connection
					if (prev && prev !== ws) {
						try {
							prev.onopen = prev.onmessage = prev.onerror = prev.onclose = null
							prev.close(1000, 'Replaced by new connection')
						} catch {}
					}

					set({ connection: ws })
				} catch (error) {
					get().addDebugMessage('Failed to create WebSocket connection', error)
					set({ isConnecting: false })
					get().retryConnection()
				}
			},

			disconnect: () => {
				const { connection, addDebugMessage, retryTimeoutId } = get()

				if (retryTimeoutId) clearTimeout(retryTimeoutId)

				set({
					intentionallyClosed: true,
					retryTimeoutId: null,
					retryCount: 0,
					retryInterval: INITIAL_RETRY_INTERVAL,
				})

				if (connection) {
					try {
						connection.onopen =
							connection.onmessage =
							connection.onerror =
							connection.onclose =
								null
						connection.close(1000, 'Intentional disconnect')
						addDebugMessage('WebSocket intentionally disconnected')
					} catch (e) {
						addDebugMessage('Error during intentional disconnect', e)
					}
				}

				set({
					connection: null,
					isConnected: false,
					isConnecting: false,
				})
			},

			subscribe: (gateId: string) => {
				const { connection, isConnected, addDebugMessage } = get()

				set((state) => {
					const deduped = state.subscribedGates.includes(gateId)
						? state.subscribedGates
						: [...state.subscribedGates, gateId]
					return { subscribedGates: deduped }
				})

				if (
					isConnected &&
					connection &&
					connection.readyState === WebSocket.OPEN
				) {
					try {
						connection.send(
							JSON.stringify({ type: 'subscribe', payload: { gateId } }),
						)
						addDebugMessage(`Subscribed to gate: ${gateId}`)
					} catch (e) {
						addDebugMessage('Failed to send subscribe for gate', {
							gateId,
							error: e,
						})
					}
				} else {
					addDebugMessage(
						`Gate ${gateId} subscription queued until connection is established`,
					)
				}
			},

			unsubscribe: (gateId: string) => {
				const { connection, isConnected, addDebugMessage } = get()

				set((state) => ({
					subscribedGates: state.subscribedGates.filter((g) => g !== gateId),
				}))

				if (
					isConnected &&
					connection &&
					connection.readyState === WebSocket.OPEN
				) {
					try {
						connection.send(
							JSON.stringify({ type: 'unsubscribe', payload: { gateId } }),
						)
						addDebugMessage(`Unsubscribed from gate: ${gateId}`)
					} catch (e) {
						addDebugMessage('Failed to send unsubscribe for gate', {
							gateId,
							error: e,
						})
					}
				}
			},

			subscribeToAdmin: () => {
				const { connection, isConnected, subscribedToAdmin, addDebugMessage } =
					get()

				if (subscribedToAdmin) {
					addDebugMessage('Already subscribed to admin updates')
					return
				}

				set({ subscribedToAdmin: true })

				if (
					isConnected &&
					connection &&
					connection.readyState === WebSocket.OPEN
				) {
					try {
						connection.send(
							JSON.stringify({
								type: 'subscribe',
								payload: { gateId: 'admin' },
							}),
						)
						addDebugMessage('Subscribed to admin updates')
					} catch (e) {
						addDebugMessage('Failed to send admin subscribe', e)
					}
				} else {
					addDebugMessage(
						'Admin subscription queued until connection is established',
					)
				}
			},

			unsubscribeFromAdmin: () => {
				const { connection, isConnected, subscribedToAdmin, addDebugMessage } =
					get()

				if (!subscribedToAdmin) {
					addDebugMessage('Not subscribed to admin updates')
					return
				}

				set({ subscribedToAdmin: false })

				if (
					isConnected &&
					connection &&
					connection.readyState === WebSocket.OPEN
				) {
					try {
						connection.send(
							JSON.stringify({
								type: 'unsubscribe',
								payload: { gateId: 'admin' },
							}),
						)
						addDebugMessage('Unsubscribed from admin updates')
					} catch (e) {
						addDebugMessage('Failed to send admin unsubscribe', e)
					}
				}
			},

			clearAdminUpdates: () => {
				set((state) => ({ adminUpdates: [], messages: state.messages }))
				get().addDebugMessage('Cleared admin updates')
			},

			testBackendAdminUpdates: () => {
				const { connection, isConnected, addDebugMessage } = get()

				if (
					!isConnected ||
					!connection ||
					connection.readyState !== WebSocket.OPEN
				) {
					addDebugMessage('Cannot test admin updates - WebSocket not connected')
					return
				}

				const testMessage = {
					type: 'subscribe',
					payload: {
						gateId: 'admin-test',
					},
				}

				try {
					connection.send(JSON.stringify(testMessage))
					addDebugMessage('Sent test admin update subscription', testMessage)
				} catch (e) {
					addDebugMessage('Failed to send test admin update', e)
				}
			},
		}),

		{
			name: 'ws-store', // key for localStorage
			partialize: (state) => ({
				adminUpdates: state.adminUpdates,
				subscribedToAdmin: state.subscribedToAdmin,
				subscribedGates: state.subscribedGates,
			}),
		},
	),
)
