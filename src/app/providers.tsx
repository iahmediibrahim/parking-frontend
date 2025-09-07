'use client'

import { makePersister, queryClient } from '@/core'
import { useAuthStore } from '@/features'
import { Loader } from '@/shared'
import {
	Persister,
	PersistQueryClientProvider,
} from '@tanstack/react-query-persist-client'
import { useEffect, useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
	const { isLoading } = useAuthStore()
	const [persister, setPersister] = useState<Persister | null>(null)

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
