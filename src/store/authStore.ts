import { create } from 'zustand'
import { getValidAuthData, setAuthData, removeAuthData } from '@/lib/auth'
import { User } from '@/types'

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

	logout: () => {
		removeAuthData()
		set({ user: null, token: null, isLoading: false })
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
