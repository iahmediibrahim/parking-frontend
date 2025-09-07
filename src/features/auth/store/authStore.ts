import { makePersister, queryClient, User, useWebSocketStore } from '@/core'
import { getValidAuthData, removeAuthData, setAuthData } from '@/features'
import { create } from 'zustand'

interface AuthState {
	user: User | null
	token: string | null
	isLoading: boolean
	login: (user: User, token: string) => void
	logout: () => void
	initialize: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	token: null,
	isLoading: true,

	login: (user, token) => {
		const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
		setAuthData({ user, token, expiresAt })
		set({ user, token, isLoading: false })
	},

	logout: async () => {
		removeAuthData()
		set({ user: null, token: null, isLoading: false })
		// 1. Clear all React Query cache in memory
		queryClient.clear()

		// 2. Clear persisted cache in localStorage
		const persister = makePersister()
		await persister.removeClient()

		useWebSocketStore.getState().clearAdminUpdates()
	},

	initialize: () => {
		const authData = getValidAuthData()
		if (authData) {
			set({ user: authData.user, token: authData.token, isLoading: false })
		} else {
			set({ user: null, token: null, isLoading: false })
		}
	},
}))
