import { api } from '@/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useZones = (gateId?: string) => {
	return useQuery({
		queryKey: ['zones', gateId],
		queryFn: () => api.getZones(gateId),
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
