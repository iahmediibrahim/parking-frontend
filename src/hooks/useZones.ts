import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'

export const useZones = (gateId?: string) => {
	return useQuery({
		queryKey: ['zones', gateId],
		queryFn: () => api.getZones(gateId),
		enabled: !!gateId,
	})
}

export const useUpdateZone = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, open }: { id: string; open: boolean }) =>
			api.toggleZone(id, open),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['zones'] })
			queryClient.invalidateQueries({ queryKey: ['parking-state'] })
		},
	})
}
