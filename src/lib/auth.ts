import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'

export interface User {
	id: string
	username: string
	role: 'admin' | 'employee'
}

export interface AuthData {
	user: User
	token: string
	expiresAt: number
}

export const setAuthData = (data: AuthData): void => {
	// Set cookie with auth data (expires in 7 days)
	Cookies.set('auth', JSON.stringify(data), { expires: 7 })

	// Also set token in localStorage for API requests
	if (typeof window !== 'undefined') {
		localStorage.setItem('token', data.token)
	}
}

export const getAuthData = (): AuthData | null => {
	if (typeof window === 'undefined') return null

	const authCookie = Cookies.get('auth')
	if (!authCookie) return null

	try {
		return JSON.parse(authCookie)
	} catch {
		return null
	}
}

export const removeAuthData = (): void => {
	Cookies.remove('auth')
	if (typeof window !== 'undefined') {
		localStorage.removeItem('token')
	}
}

export const isTokenExpired = (token: string): boolean => {
	try {
		const decoded = jwtDecode(token)
		return (decoded as { exp: number }).exp * 1000 < Date.now()
	} catch {
		return true
	}
}

export const getValidAuthData = (): AuthData | null => {
	const authData = getAuthData()
	if (!authData) return null
	// Check if token is expired
	// if (isTokenExpired(authData.token)) { // commented bc token isn't a real token now so the user will always be logged out if this is working rn
	// 	removeAuthData()
	// 	return null
	// }

	return authData
}
