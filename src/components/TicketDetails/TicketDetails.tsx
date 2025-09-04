import { Ticket, Subscription } from '@/types'
import { PrimaryButton, SubscriptionDetails } from '@/components'
import * as motion from 'motion/react-client'

interface TicketDetailsProps {
	ticket: Ticket
	subscription?: Subscription
	forceConvert: boolean
	setForceConvert: (value: boolean) => void
	handleCheckout: () => void
	isCheckingOut: boolean
}

export function TicketDetails({
	ticket,
	subscription,
	forceConvert,
	setForceConvert,
	handleCheckout,
	isCheckingOut,
}: TicketDetailsProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-200"
		>
			<h3 className="text-xl font-semibold mb-4">Ticket Details</h3>
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<p className="text-gray-600">
						ID: <span className="font-medium text-gray-900">{ticket.id}</span>
					</p>
					<p className="text-gray-600">
						Type:{' '}
						<span className="font-medium text-gray-900">{ticket.type}</span>
					</p>
					<p className="text-gray-600">
						Zone:{' '}
						<span className="font-medium text-gray-900">{ticket.zoneId}</span>
					</p>
				</div>
				<div className="space-y-2">
					<p className="text-gray-600">
						Gate:{' '}
						<span className="font-medium text-gray-900">{ticket.gateId}</span>
					</p>
					<p className="text-gray-600">
						Check-in:{' '}
						<span className="font-medium text-gray-900">
							{new Date(ticket.checkinAt).toLocaleString()}
						</span>
					</p>
				</div>
			</div>

			{ticket.type === 'subscriber' && subscription && (
				<SubscriptionDetails
					subscription={subscription}
					forceConvert={forceConvert}
					setForceConvert={setForceConvert}
				/>
			)}

			<div className="flex justify-end mt-6">
				<PrimaryButton onClick={handleCheckout} disabled={isCheckingOut}>
					{isCheckingOut ? 'Processing...' : 'Check Out'}
				</PrimaryButton>
			</div>
		</motion.div>
	)
}
