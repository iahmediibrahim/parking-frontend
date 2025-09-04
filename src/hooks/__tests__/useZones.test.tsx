import { renderHook, waitFor } from '@testing-library/react'
import { useZones } from '../useZones'
import { api } from '@/services/api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Mock the API
jest.mock('@/services/api', () => ({
	api: {
		getZones: jest.fn(),
	},
}))

const wrapper = ({ children }: { children: React.ReactNode }) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	})
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)
}

describe('useZones', () => {
	it('returns zones when gateId is provided', async () => {
		const mockZones = [{ id: '1', name: 'Zone 1' }]
		;(api.getZones as jest.Mock).mockResolvedValue(mockZones)

		const { result } = renderHook(() => useZones('1'), { wrapper })

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false)
		})

		expect(result.current.data).toEqual(mockZones)
		expect(api.getZones).toHaveBeenCalledWith('1')
	})

	it('calls getZones without id when gateId is not provided', () => {
		renderHook(() => useZones(), { wrapper })
		expect(api.getZones).toHaveBeenCalled()
	})
})
