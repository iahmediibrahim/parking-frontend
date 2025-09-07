'use client'
import { CheckoutResponse } from '@/core'
import { LookupInput, useCheckout, useSubscription, useTicket } from '@/shared'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CheckoutSummary } from '../CheckoutSummary'
import { TicketDetails } from '../TicketDetails'

export function CheckpointClient() {
	const [ticketId, setTicketId] = useState<string>('')
	const [lookupId, setLookupId] = useState<string>('')
	const [showDetails, setShowDetails] = useState<boolean>(false)
	const [checkoutData, setCheckoutData] = useState<CheckoutResponse | null>(
		null,
	)
	const [forceConvert, setForceConvert] = useState<boolean>(false)
	const [isLookingUp, setIsLookingUp] = useState<boolean>(false)

	const {
		data: ticket,
		error: ticketError,
		refetch,
	} = useTicket(lookupId, {
		enabled: false,
		retry: false,
	})

	const { data: subscription } = useSubscription(ticket?.subscriptionId || '', {
		enabled: !!ticket?.subscriptionId,
	})

	const { mutate: checkout, isPending: isCheckingOut } = useCheckout()

	useEffect(() => {
		if (lookupId) {
			refetch().then((result) => {
				if (result.error) {
					toast.error('Invalid ticket ID or ticket not found')
					setIsLookingUp(false)
				} else if (result.data) {
					setShowDetails(true)
					setIsLookingUp(false)
				}
			})
		}
	}, [lookupId, refetch])

	const handleLookup = () => {
		if (!ticketId || isLookingUp) return

		setIsLookingUp(true)
		setShowDetails(false)
		setCheckoutData(null)
		setLookupId(ticketId)
	}

	const handleCheckout = () => {
		if (!ticketId) return

		checkout(
			{ ticketId, forceConvertToVisitor: forceConvert },
			{
				onSuccess: (data: CheckoutResponse) => {
					setCheckoutData(data)
					toast.success('Checkout completed successfully')
					setTicketId('')
					setLookupId('')
					setShowDetails(false)
					setForceConvert(false)
				},
				onError: (error: Error) => {
					console.error('Checkout failed', error)
					const errorMessage = error?.message || 'Failed to checkout'
					toast.error(errorMessage)
				},
			},
		)
	}

	return (
		<div className="">
			<div className="bg-white rounded-xl shadow-lg p-8">
				<h1 className="text-3xl font-semibold mb-8 text-gray-800">
					Checkpoint
				</h1>

				<LookupInput
					value={ticketId}
					onChange={setTicketId}
					onLookup={handleLookup}
					label="Ticket ID"
					placeholder="Enter ticket ID"
					disabled={isCheckingOut || isLookingUp}
					btnText={isLookingUp ? 'Looking up...' : 'Lookup'}
				/>

				{ticketError && (
					<div className="text-red-500 mt-3 text-sm mx-4">
						Failed to lookup ticket. Please try again.
					</div>
				)}

				{showDetails && ticket && (
					<TicketDetails
						ticket={ticket}
						subscription={subscription}
						forceConvert={forceConvert}
						setForceConvert={setForceConvert}
						handleCheckout={handleCheckout}
						isCheckingOut={isCheckingOut}
					/>
				)}

				{checkoutData && (
					<CheckoutSummary
						checkoutData={checkoutData}
						setCheckoutData={setCheckoutData}
					/>
				)}
			</div>
		</div>
	)
}
