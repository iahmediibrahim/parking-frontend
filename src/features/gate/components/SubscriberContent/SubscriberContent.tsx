import { TabContentProps } from '@/core'
import { CheckinButton } from '../CheckinButton'
import { SubscriptionVerification } from '../SubscriptionVerification'
import { ZoneGrid } from '../ZoneGrid'

export function SubscriberContent({
	subscriptionId,
	setSubscriptionId,
	verifiedSubscription,
	handleVerifySubscription,
	zones,
	selectedZone,
	setSelectedZone,
	onCheckin,
	isCheckingIn,
}: TabContentProps) {
	return (
		<div className="space-y-6">
			<SubscriptionVerification
				subscriptionId={subscriptionId!}
				setSubscriptionId={setSubscriptionId!}
				verifiedSubscription={verifiedSubscription!}
				handleVerifySubscription={handleVerifySubscription!}
			/>

			<ZoneGrid
				zones={zones}
				selectedZone={selectedZone}
				setSelectedZone={setSelectedZone}
				type="subscriber"
			/>
			<div className="flex justify-end">
				<CheckinButton
					onClick={onCheckin}
					disabled={
						!selectedZone || !verifiedSubscription?.active || isCheckingIn
					}
					isCheckingIn={isCheckingIn}
				/>
			</div>
		</div>
	)
}
