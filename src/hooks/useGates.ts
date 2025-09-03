import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import { Gate } from '@/types'

export const useGates = () => {
	return useQuery<Gate[], Error>({
		queryKey: ['gates'],
		queryFn: api.getGates,
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}
