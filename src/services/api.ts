import { getValidAuthData } from '@/lib/auth'
import {
	Category,
	Gate,
	RushHour,
	Subscription,
	Ticket,
	Vacation,
	Zone,
} from '@/types'

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1'

// Helper function to get auth headers
const getAuthHeaders = () => {
	const authData = getValidAuthData()
	return authData?.token
		? {
				Authorization: `Bearer ${authData.token}`,
				'Content-Type': 'application/json',
		  }
		: {}
}

export const api = {
	// Auth
	login: async (username: string, password: string) => {
		const response = await fetch(`${API_BASE_URL}/auth/login`, {
			method: 'POST',
			headers: getAuthHeaders() as Record<string, string>,

			body: JSON.stringify({ username, password }),
		})

		if (!response.ok) {
			throw new Error('Login failed')
		}

		return response.json()
	},

	// Master data
	getGates: async (): Promise<Gate[]> => {
		const response = await fetch(`${API_BASE_URL}/master/gates`, {
			headers: getAuthHeaders() as Record<string, string>,
		})
		return response.json()
	},

	getZones: async (gateId?: string): Promise<Zone[]> => {
		const url = gateId
			? `${API_BASE_URL}/master/zones?gateId=${gateId}`
			: `${API_BASE_URL}/master/zones`
		const response = await fetch(url, {
			headers: getAuthHeaders() as Record<string, string>,
		})
		return response.json()
	},

	getCategories: async (): Promise<Category[]> => {
		const response = await fetch(`${API_BASE_URL}/master/categories`, {
			headers: getAuthHeaders() as Record<string, string>,
		})
		return response.json()
	},

	// Subscriptions
	getSubscription: async (id: string): Promise<Subscription> => {
		const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
			headers: getAuthHeaders() as Record<string, string>,
		})
		return response.json()
	},

	// Tickets
	checkin: async (data: {
		gateId: string
		zoneId: string
		type: 'visitor' | 'subscriber'
		subscriptionId?: string
	}) => {
		const response = await fetch(`${API_BASE_URL}/tickets/checkin`, {
			method: 'POST',
			headers: getAuthHeaders() as Record<string, string>,
			body: JSON.stringify(data),
		})
		return response.json()
	},

	checkout: async (ticketId: string, forceConvertToVisitor = false) => {
		const response = await fetch(`${API_BASE_URL}/tickets/checkout`, {
			method: 'POST',
			headers: getAuthHeaders() as Record<string, string>,
			body: JSON.stringify({ ticketId, forceConvertToVisitor }),
		})
		return response.json()
	},

	getTicket: async (id: string): Promise<Ticket> => {
		const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
			headers: getAuthHeaders() as Record<string, string>,
		})
		return response.json()
	},

	// Admin endpoints
	getParkingState: async (): Promise<Zone[]> => {
		const response = await fetch(
			`${API_BASE_URL}/admin/reports/parking-state`,
			{
				headers: getAuthHeaders() as Record<string, string>,
			},
		)
		return response.json()
	},

	updateCategory: async (id: string, data: Partial<Category>) => {
		const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
			method: 'PUT',
			headers: getAuthHeaders() as Record<string, string>,

			body: JSON.stringify(data),
		})
		return response.json()
	},

	toggleZone: async (id: string, open: boolean) => {
		const response = await fetch(`${API_BASE_URL}/admin/zones/${id}/open`, {
			method: 'PUT',
			headers: getAuthHeaders() as Record<string, string>,

			body: JSON.stringify({ open }),
		})
		return response.json()
	},

	getRushHours: async (): Promise<RushHour[]> => {
		const response = await fetch(`${API_BASE_URL}/admin/rush-hours`)
		return response.json()
	},

	createRushHour: async (data: Omit<RushHour, 'id'>) => {
		const response = await fetch(`${API_BASE_URL}/admin/rush-hours`, {
			method: 'POST',
			headers: getAuthHeaders() as Record<string, string>,

			body: JSON.stringify(data),
		})
		return response.json()
	},

	deleteRushHour: async (id: string) => {
		const response = await fetch(`${API_BASE_URL}/admin/rush-hours/${id}`, {
			method: 'DELETE',
		})
		return response.json()
	},

	getVacations: async (): Promise<Vacation[]> => {
		const response = await fetch(`${API_BASE_URL}/admin/vacations`)
		return response.json()
	},

	createVacation: async (data: Omit<Vacation, 'id'>) => {
		const response = await fetch(`${API_BASE_URL}/admin/vacations`, {
			method: 'POST',
			headers: getAuthHeaders() as Record<string, string>,

			body: JSON.stringify(data),
		})
		return response.json()
	},

	deleteVacation: async (id: string) => {
		const response = await fetch(`${API_BASE_URL}/admin/vacations/${id}`, {
			method: 'DELETE',
		})
		return response.json()
	},
}
