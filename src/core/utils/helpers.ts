import { getValidAuthData } from '@/features/auth/utils/auth'

export function formatCategoryName(categoryId: string): string {
	const cleanedCategory = categoryId.replace('cat_', '')
	return `${cleanedCategory.charAt(0).toUpperCase()}${cleanedCategory.slice(
		1,
	)} Category`
}

// Date formatting utilities
export function formatDateTime(date: string | Date): string {
	const dateObj = new Date(date)
	return dateObj.toLocaleString()
}

export function formatDate(date: string | Date): string {
	const dateObj = new Date(date)
	return dateObj.toLocaleDateString()
}

export function formatTime(date: string | Date): string {
	const dateObj = new Date(date)
	return dateObj.toLocaleTimeString()
}

export function formatDuration(hours: number): string {
	const h = Math.floor(hours)
	const m = Math.round((hours - h) * 60)
	return h > 0 ? `${h}h ${m}m` : `${m}m`
}

// Helper function to get auth headers
export function getAuthHeaders() {
	const authData = getValidAuthData()
	return authData?.token
		? {
				Authorization: `Bearer ${authData.token}`,
				'Content-Type': 'application/json',
		  }
		: {
				'Content-Type': 'application/json',
		  }
}

// API error handling
export async function handleApiError(response: Response): Promise<unknown> {
	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'An error occurred')
	}
	return response.json()
}
