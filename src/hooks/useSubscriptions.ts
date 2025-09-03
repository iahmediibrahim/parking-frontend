import { api } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export const useSubscription = (subscriptionId?: string) => {
	return useQuery({
		queryKey: ['subscription', subscriptionId],
		queryFn: () => api.getSubscription(subscriptionId as string),
		enabled: !!subscriptionId,
	})
}
