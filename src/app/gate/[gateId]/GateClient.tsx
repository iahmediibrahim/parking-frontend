'use client'
import React from 'react'
import { Zone, Subscription, Ticket } from '@/types'
import { useZones } from '@/hooks/useZones'
import { CheckinParams, useCheckin } from '@/hooks/useTickets'
import { useSubscription } from '@/hooks/useSubscriptions'
import { Loader, PrintableTicket, SubscriberContent, Tabs } from '@/components'
import toast from 'react-hot-toast'
import { VisitorContent } from '@/components/VisitorContent'
import { useWebSocket } from '@/hooks/useWebSocket'

export default function GateClient({ gateId }: { gateId: string }) {
	const [selectedZone, setSelectedZone] = React.useState<string | null>(null)
	const [subscriptionId, setSubscriptionId] = React.useState('')
	const [verifiedSubscription, setVerifiedSubscription] =
		React.useState<Subscription | null>(null)
	const [showTicket, setShowTicket] = React.useState(false)
	const [ticketData, setTicketData] = React.useState<Ticket | null>(null)
	const [isVerifying, setIsVerifying] = React.useState(false)

	const { data: zones, isLoading, error, refetch } = useZones(gateId)
	const { mutate: checkin, isPending: isCheckingIn } = useCheckin()
	const { refetch: verifySubscription, error: subscriptionError } =
		useSubscription(subscriptionId, {
			enabled: false,
			retry: false,
		})

	const { isConnected, messages } = useWebSocket(gateId)

	React.useEffect(() => {
		const lastMessage = messages[messages.length - 1]
		if (lastMessage?.type === 'zone-update') {
			refetch()
		}
	}, [messages, refetch])

	const handleVerifySubscription = React.useCallback(async () => {
		if (!subscriptionId || isVerifying) return

		setIsVerifying(true)
		try {
			const result = await verifySubscription()
			if (result.data) {
				setVerifiedSubscription(result.data)
			} else {
				toast.error('No subscription found')
				setVerifiedSubscription(null)
			}
		} catch (err) {
			const errorMessage =
				subscriptionError?.message || 'Failed to verify subscription'
			toast.error(errorMessage)
			console.error('Failed to verify subscription:', err)
			setVerifiedSubscription(null)
		} finally {
			setIsVerifying(false)
		}
	}, [subscriptionId, isVerifying, verifySubscription, subscriptionError])

	const handleCheckin = React.useCallback(
		(type: 'visitor' | 'subscriber') => {
			if (!selectedZone) return

			const checkinData: CheckinParams = {
				gateId,
				zoneId: selectedZone,
				type,
				...(type === 'subscriber' &&
					verifiedSubscription && {
						subscriptionId: verifiedSubscription.id,
					}),
			}

			checkin(checkinData, {
				onSuccess: (data) => {
					setTicketData(data.ticket)
					setShowTicket(true)
					setSelectedZone(null)
					setSubscriptionId('')
					setVerifiedSubscription(null)
					toast.success('Check-in successful')
				},
				onError: (error) => {
					console.error('Checkin failed:', error)
					toast.error(`Check-in failed. ${error.message}`)
				},
			})
		},
		[selectedZone, gateId, verifiedSubscription, checkin],
	)

	if (error) {
		return (
			<div className="flex items-center justify-center h-[50vh]">
				<div className="text-center space-y-4">
					<p className="text-red-600 text-lg font-medium">
						Error loading zones: {error.message}
					</p>
					<button
						onClick={() => refetch()}
						className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
					>
						Try Again
					</button>
				</div>
			</div>
		)
	}
	if (isLoading) return <Loader />

	const tabs = [
		{
			id: 'visitor',
			label: 'Visitor',
			content: (
				<VisitorContent
					zones={zones as Zone[]}
					selectedZone={selectedZone}
					setSelectedZone={setSelectedZone}
					onCheckin={() => handleCheckin('visitor')}
					isCheckingIn={isCheckingIn}
				/>
			),
		},
		{
			id: 'subscriber',
			label: 'Subscriber',
			content: (
				<SubscriberContent
					subscriptionId={subscriptionId}
					setSubscriptionId={setSubscriptionId}
					verifiedSubscription={verifiedSubscription}
					handleVerifySubscription={handleVerifySubscription}
					zones={zones as Zone[]}
					selectedZone={selectedZone}
					setSelectedZone={setSelectedZone}
					onCheckin={() => handleCheckin('subscriber')}
					isCheckingIn={isCheckingIn}
				/>
			),
		},
	]

	return (
		<div className="space-y-6">
			<div className="bg-white rounded-xl shadow-lg p-6">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-gray-900">Gate: {gateId}</h1>
					<div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
						<div
							className={`w-3 h-3 rounded-full ${
								isConnected ? 'bg-green-500' : 'bg-red-500'
							}`}
						/>
						<span className="text-sm font-medium text-gray-700">
							{isConnected ? 'Connected' : 'Disconnected'}
						</span>
					</div>
				</div>
				<Tabs tabs={tabs} defaultTab="visitor" />
			</div>
			<PrintableTicket
				showTicket={showTicket}
				setShowTicket={setShowTicket}
				ticketData={ticketData!}
			/>
		</div>
	)
}
