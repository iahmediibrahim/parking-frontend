import { api } from '@/services/api'
import { Subscription } from '@/types'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

export const useSubscription = (
	subscriptionId: string,
	options?: Omit<
		UseQueryOptions<Subscription, Error, Subscription, string[]>,
		'queryKey' | 'queryFn'
	>,
) => {
	return useQuery({
		queryKey: ['subscription', subscriptionId],
		queryFn: () => api.getSubscription(subscriptionId),
		enabled: !!subscriptionId,
		...options,
	})
}
