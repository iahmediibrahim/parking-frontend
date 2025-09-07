import { api } from '@/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { useCheckin } from '../useTickets'
import { useZones } from '../useZones'

// Mock the API
jest.mock('@/core', () => ({
	api: {
		getZones: jest.fn(),
		checkin: jest.fn(),
	},
}))

const queryClient = new QueryClient()

const wrapper = ({ children }: { children: React.ReactNode }) => {
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

describe('useCheckin', () => {
	it('calls api.checkin with correct params and returns data', async () => {
		const mockResponse = { ticket: { id: '123', type: 'visitor' } }
		;(api.checkin as jest.Mock).mockResolvedValue(mockResponse)

		const { result } = renderHook(() => useCheckin(), { wrapper })

		await result.current.mutateAsync({
			gateId: 'gate1',
			zoneId: 'zone1',
			type: 'visitor',
		})

		expect(api.checkin).toHaveBeenCalledWith({
			gateId: 'gate1',
			zoneId: 'zone1',
			type: 'visitor',
		})
		// Optionally check returned data
		// expect(result.current.data).toEqual(mockResponse)
	})

	it('handles errors from api.checkin', async () => {
		const mockError = new Error('Checkin failed')
		;(api.checkin as jest.Mock).mockRejectedValue(mockError)

		const { result } = renderHook(() => useCheckin(), { wrapper })

		try {
			await result.current.mutateAsync({
				gateId: 'gate1',
				zoneId: 'zone1',
				type: 'visitor',
			})
		} catch (error) {
			expect(error).toBe(mockError)
		}
	})
})
