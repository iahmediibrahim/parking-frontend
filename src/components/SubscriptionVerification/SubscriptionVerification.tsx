import { formatCategoryName } from '@/helpers'
import { Subscription } from '@/types'
import { PrimaryButton } from '../PrimaryButton'

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
		<div className="mx-4 mb-6 space-y-6">
			<div className="flex flex-col space-y-3">
				<label className="text-sm font-semibold text-gray-700">
					Subscription ID
				</label>
				<div className="flex gap-3">
					<input
						type="text"
						value={subscriptionId}
						onChange={(e) => setSubscriptionId(e.target.value)}
						className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
						placeholder="Enter subscription ID"
					/>
					<PrimaryButton
						onClick={handleVerifySubscription}
						disabled={!subscriptionId}
					>
						Verify
					</PrimaryButton>
				</div>
			</div>

			{verifiedSubscription && (
				<div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
					<div className="flex items-center gap-3 mb-4">
						<div
							className={`w-3 h-3 rounded-full ${
								verifiedSubscription.active ? 'bg-green-500' : 'bg-red-500'
							}`}
						/>
						<h3 className="text-lg font-semibold text-gray-900">
							Subscription Details
						</h3>
					</div>
					<div className="space-y-3">
						<div className="flex justify-between items-center py-2 border-b border-gray-100">
							<span className="text-gray-600">Name</span>
							<span className="font-medium text-gray-900">
								{verifiedSubscription.userName}
							</span>
						</div>
						<div className="flex justify-between items-center py-2 border-b border-gray-100">
							<span className="text-gray-600">Category</span>
							<span className="font-medium text-gray-900">
								{formatCategoryName(verifiedSubscription.category)}
							</span>
						</div>
						<div className="flex justify-between items-center py-2">
							<span className="text-gray-600">Status</span>
							<span
								className={`font-medium ${
									verifiedSubscription.active
										? 'text-green-600'
										: 'text-red-600'
								}`}
							>
								{verifiedSubscription.active ? 'Active' : 'Inactive'}
							</span>
						</div>
					</div>
					{verifiedSubscription.active ? (
						<p className="mt-4 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
							✓ Subscription active. You can check in.
						</p>
					) : (
						<p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
							⚠ Subscription not active. Please verify your subscription.
						</p>
					)}
				</div>
			)}
		</div>
	)
}
