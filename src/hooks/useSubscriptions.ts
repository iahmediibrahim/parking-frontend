import { api } from '@/services/api'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

export const useSubscription = (
	subscriptionId: string,
	options?: Omit<
		UseQueryOptions<any, Error, any, string[]>,
		'queryKey' | 'queryFn'
	>,
) => {
	return useQuery({
		queryKey: ['subscription', subscriptionId],
		queryFn: () => api.getSubscription(subscriptionId as string),
		enabled: !!subscriptionId,
		...options,
	})
}
