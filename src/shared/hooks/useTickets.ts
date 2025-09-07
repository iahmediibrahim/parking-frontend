import { api, CheckInResponse, CheckoutResponse } from '@/core'
import { useMutation, useQuery } from '@tanstack/react-query'

export type CheckinParams = {
	gateId: string
	zoneId: string
	type: 'visitor' | 'subscriber'
	subscriptionId?: string
}

type CheckoutParams = {
	ticketId: string
	forceConvertToVisitor?: boolean
}

export const useCheckin = () => {
	return useMutation<CheckInResponse, Error, CheckinParams>({
		mutationFn: api.checkin,
	})
}

export const useCheckout = () => {
	return useMutation<CheckoutResponse, Error, CheckoutParams>({
		mutationFn: ({ ticketId, forceConvertToVisitor }) =>
			api.checkout(ticketId, forceConvertToVisitor),
	})
}

export const useTicket = (
	id: string,
	options?: { enabled?: boolean; retry?: boolean },
) => {
	return useQuery({
		queryKey: ['ticket', id],
		queryFn: () => api.getTicket(id),
		enabled: options?.enabled ?? !!id,
		retry: options?.retry,
	})
}
