'use client'

import { Loader } from '@/components'
import { useAuthStore } from '@/store/authStore'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { queryClient, makePersister } from '@/services/queryClient'
import { useState, useEffect } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
	const { isLoading } = useAuthStore()
	const [persister, setPersister] = useState<any>(null)

	useEffect(() => {
		// ✅ runs only on client
		setPersister(makePersister())
	}, [])

	if (isLoading) return <Loader />
	if (!persister) return null // or a small loader until persister is ready

	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{ persister }}
		>
			{children}
		</PersistQueryClientProvider>
	)
}
