'use client'

import { Loader } from '@/components'
import { useAuthStore } from '@/store/authStore'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000, // 1 minute
					},
				},
			}),
	)
	const { isLoading } = useAuthStore()

	if (isLoading) return <Loader />

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)
}
