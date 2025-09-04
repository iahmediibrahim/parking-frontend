import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'

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
	return useMutation<any, Error, CheckinParams>({
		mutationFn: api.checkin,
	})
}

export const useCheckout = () => {
	return useMutation<any, Error, CheckoutParams>({
		mutationFn: ({ ticketId, forceConvertToVisitor }) =>
			api.checkout(ticketId, forceConvertToVisitor),
	})
}

export const useTicket = (id: string) => {
	return useQuery({
		queryKey: ['ticket', id],
		queryFn: () => api.getTicket(id),
		enabled: !!id,
	})
}
