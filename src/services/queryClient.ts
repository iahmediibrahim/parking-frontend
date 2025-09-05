import { QueryClient } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60 * 24, // 24 hours
		},
	},
})

// 🚨 don't access window here directly
export const makePersister = () =>
	createAsyncStoragePersister({
		storage: window.localStorage,
	})
