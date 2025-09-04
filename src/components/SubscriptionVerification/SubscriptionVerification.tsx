import { formatCategoryName } from '@/helpers'
import { Subscription } from '@/types'

interface SubscriptionVerificationProps {
	subscriptionId: string
	setSubscriptionId: (id: string) => void
	verifiedSubscription: Subscription | null
	handleVerifySubscription: () => void
}

export function SubscriptionVerification({
	subscriptionId,
	setSubscriptionId,
	verifiedSubscription,
	handleVerifySubscription,
}: SubscriptionVerificationProps) {
	return (
		<div className="mb-6 space-y-4">
			<div className="flex flex-col space-y-2">
				<label className="text-sm font-semibold text-gray-700">
					Subscription ID
				</label>
				<div className="flex gap-2">
					<input
						type="text"
						value={subscriptionId}
						onChange={(e) => setSubscriptionId(e.target.value)}
						className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="Enter subscription ID"
					/>
					<button
						onClick={handleVerifySubscription}
						disabled={!subscriptionId}
						className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
					>
						Verify
					</button>
				</div>
			</div>

			{verifiedSubscription && (
				<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
					<h3 className="text-lg font-semibold text-green-800 mb-2">
						Subscription Verified
					</h3>
					<div className="space-y-1 text-sm text-green-700">
						<p>Name: {verifiedSubscription.userName}</p>
						<p>Category: {formatCategoryName(verifiedSubscription.category)}</p>
						<p>Status: {verifiedSubscription.active ? 'Active' : 'Inactive'}</p>
					</div>
				</div>
			)}
		</div>
	)
}
