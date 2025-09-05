import { getAuthHeaders, handleApiError } from '@/helpers'
import {
	Category,
	CheckInResponse,
	CheckoutResponse,
	Gate,
	LoginResponse,
	RushHour,
	Subscription,
	Ticket,
	User,
	Vacation,
	Zone,
} from '@/types'

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1'

export const api = {
	// Auth
	login: async (username: string, password: string): Promise<LoginResponse> => {
		const response = await fetch(`${API_BASE_URL}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, password }),
		})
		return handleApiError(response) as Promise<LoginResponse>
	},

	// Master data
	getGates: async (): Promise<Gate[]> => {
		const response = await fetch(`${API_BASE_URL}/master/gates`, {
			headers: getAuthHeaders() as Record<string, string>,
		})
		return handleApiError(response) as Promise<Gate[]>
	},

	getZones: async (gateId?: string): Promise<Zone[]> => {
		const url = gateId
			? `${API_BASE_URL}/master/zones?gateId=${gateId}`
			: `${API_BASE_URL}/master/zones`
		const response = await fetch(url, {
			headers: getAuthHeaders() as Record<string, string>,
		})
		return handleApiError(response) as Promise<Zone[]>
	},

	getCategories: async (): Promise<Category[]> => {
		const response = await fetch(`${API_BASE_URL}/master/categories`, {
			headers: getAuthHeaders() as Record<string, string>,
		})
		return handleApiError(response) as Promise<Category[]>
	},

	// Subscriptions
	getSubscription: async (id: string): Promise<Subscription> => {
		const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
			headers: getAuthHeaders() as Record<string, string>,
		})
		return handleApiError(response) as Promise<Subscription>
	},

	// Tickets
	checkin: async (data: {
		gateId: string
		zoneId: string
		type: 'visitor' | 'subscriber'
		subscriptionId?: string
	}): Promise<CheckInResponse> => {
		const response = await fetch(`${API_BASE_URL}/tickets/checkin`, {
			method: 'POST',
			headers: getAuthHeaders() as Record<string, string>,
			body: JSON.stringify(data),
		})
		return handleApiError(response) as Promise<CheckInResponse>
	},

	checkout: async (
		ticketId: string,
		forceConvertToVisitor = false,
	): Promise<CheckoutResponse> => {
		const response = await fetch(`${API_BASE_URL}/tickets/checkout`, {
			method: 'POST',
			headers: getAuthHeaders() as Record<string, string>,
			body: JSON.stringify({ ticketId, forceConvertToVisitor }),
		})
		return handleApiError(response) as Promise<CheckoutResponse>
	},

	getTicket: async (id: string): Promise<Ticket> => {
		const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
			headers: getAuthHeaders() as Record<string, string>,
		})
		return handleApiError(response) as Promise<Ticket>
	},

	// Admin endpoints

	getEmployees: async (): Promise<User[]> => {
		const response = await fetch(`${API_BASE_URL}/admin/users`, {
			headers: getAuthHeaders() as Record<string, string>,
		})

		return handleApiError(response) as Promise<User[]>
	},

	createEmployee: async (data: {
		username: string
		password: string
		role: 'admin' | 'employee'
	}): Promise<User> => {
		const response = await fetch(`${API_BASE_URL}/admin/users`, {
			method: 'POST',
			headers: getAuthHeaders() as Record<string, string>,
			body: JSON.stringify(data),
		})

		return handleApiError(response) as Promise<User>
	},

	getParkingState: async (): Promise<Zone[]> => {
		const response = await fetch(
			`${API_BASE_URL}/admin/reports/parking-state`,
			{
				headers: getAuthHeaders() as Record<string, string>,
			},
		)
		return handleApiError(response) as Promise<Zone[]>
	},

	updateCategory: async (id: string, data: Partial<Category>) => {
		const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
			method: 'PUT',
			headers: getAuthHeaders() as Record<string, string>,
			body: JSON.stringify(data),
		})
		return handleApiError(response)
	},

	toggleZone: async (id: string, open: boolean) => {
		const response = await fetch(`${API_BASE_URL}/admin/zones/${id}/open`, {
			method: 'PUT',
			headers: getAuthHeaders() as Record<string, string>,
			body: JSON.stringify({ open }),
		})
		return handleApiError(response)
	},

	createRushHour: async (data: Omit<RushHour, 'id'>) => {
		const response = await fetch(`${API_BASE_URL}/admin/rush-hours`, {
			method: 'POST',
			headers: getAuthHeaders() as Record<string, string>,
			body: JSON.stringify(data),
		})
		return handleApiError(response)
	},

	getVacations: async (): Promise<Vacation[]> => {
		const response = await fetch(`${API_BASE_URL}/admin/vacations`, {
			headers: getAuthHeaders() as Record<string, string>,
		})
		return handleApiError(response) as Promise<Vacation[]>
	},

	createVacation: async (data: Omit<Vacation, 'id'>) => {
		const response = await fetch(`${API_BASE_URL}/admin/vacations`, {
			method: 'POST',
			headers: getAuthHeaders() as Record<string, string>,

			body: JSON.stringify(data),
		})
		return handleApiError(response)
	},

	deleteVacation: async (id: string) => {
		const response = await fetch(`${API_BASE_URL}/admin/vacations/${id}`, {
			method: 'DELETE',
		})
		return handleApiError(response)
	},
}
