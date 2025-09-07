import { api, Gate } from '@/core'
import { useQuery } from '@tanstack/react-query'

export const useGates = () => {
	return useQuery<Gate[], Error>({
		queryKey: ['gates'],
		queryFn: api.getGates,
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}
