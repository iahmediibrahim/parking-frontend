import { Car, Subscription } from '@/core'

interface SubscriptionDetailsProps {
	subscription: Subscription
	forceConvert: boolean
	setForceConvert: (value: boolean) => void
}

export function SubscriptionDetails({
	subscription,
	forceConvert,
	setForceConvert,
}: SubscriptionDetailsProps) {
	return (
		<div className="mt-6 border-t pt-4">
			<h4 className="text-lg font-semibold mb-3">Subscription Details</h4>
			<p className="text-gray-600 mb-2">
				Name:{' '}
				<span className="font-medium text-gray-900">
					{subscription.userName}
				</span>
			</p>
			<p className="text-gray-600 mb-2">Cars:</p>
			<ul className="space-y-1 ml-4">
				{subscription.cars.map((car: Car) => (
					<li key={car.plate} className="text-gray-700">
						{car.plate} - {car.brand} {car.model} ({car.color})
					</li>
				))}
			</ul>

			<label className="mt-4 flex items-center space-x-2 text-gray-700">
				<input
					type="checkbox"
					checked={forceConvert}
					onChange={(e) => setForceConvert(e.target.checked)}
					className="rounded text-blue-600 focus:ring-blue-500"
				/>
				<span>Convert to visitor (plate mismatch)</span>
			</label>
		</div>
	)
}
