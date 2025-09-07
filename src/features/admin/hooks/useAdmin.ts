import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/core'
import { User, Zone, RushHour, Vacation, Category } from '@/core'

export const useEmployees = () => {
	return useQuery<User[]>({
		queryKey: ['employees'],
		queryFn: api.getEmployees,
	})
}
export const useCategories = () => {
	return useQuery<Category[]>({
		queryKey: ['categories'],
		queryFn: api.getCategories,
	})
}

export const useCreateEmployee = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: api.createEmployee,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['employees'] })
		},
	})
}

export const useParkingState = () => {
	return useQuery<Zone[]>({
		queryKey: ['parking-state'],
		queryFn: api.getParkingState,
	})
}

export const useToggleZone = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, open }: { id: string; open: boolean }) =>
			api.toggleZone(id, open),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['parking-state'] })
			queryClient.invalidateQueries({ queryKey: ['zones'] })
		},
	})
}

export const useUpdateCategoryRates = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			rateNormal,
			rateSpecial,
		}: {
			id: string
			rateNormal: number
			rateSpecial: number
		}) => api.updateCategory(id, { rateNormal, rateSpecial }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] })
		},
	})
}

export const useCreateRushHour = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: api.createRushHour,
		onSuccess: (newRushHour) => {
			queryClient.setQueryData<RushHour[]>(['rush-hours'], (old = []) => [
				...(old as RushHour[]),
				newRushHour as RushHour,
			])
		},
	})
}
export const useRushHours = () => {
	const queryClient = useQueryClient()
	const rushHours = queryClient.getQueryData<RushHour[]>(['rush-hours']) ?? []
	return rushHours
}

export const useCreateVacation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: api.createVacation,
		onSuccess: (newVacation) => {
			queryClient.setQueryData<Vacation[]>(['vacations'], (old = []) => [
				...(old as Vacation[]),
				newVacation as Vacation,
			])
		},
	})
}

export const useVacations = () => {
	const queryClient = useQueryClient()
	const vacations = queryClient.getQueryData<Vacation[]>(['vacations']) ?? []
	return vacations
}

export const useDeleteVacation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: api.deleteVacation,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['vacations'] })
		},
	})
}
