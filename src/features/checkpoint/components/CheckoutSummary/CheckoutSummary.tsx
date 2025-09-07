import { CheckoutResponse } from '@/core'
import * as motion from 'motion/react-client'
interface CheckoutSummaryProps {
	checkoutData: CheckoutResponse
	setCheckoutData: (data: CheckoutResponse | null) => void
}
export function CheckoutSummary({
	checkoutData,
	setCheckoutData,
}: CheckoutSummaryProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="mt-6 bg-green-50 rounded-xl p-6 border border-green-200 relative"
		>
			<button
				onClick={() => setCheckoutData(null)}
				className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clipRule="evenodd"
					/>
				</svg>
			</button>

			<h3 className="text-xl font-semibold text-green-800 mb-4">
				Checkout Complete
			</h3>

			<div className="space-y-2 mb-6">
				<p className="text-green-700">
					Duration:{' '}
					<span className="font-medium">
						{checkoutData.durationHours.toFixed(2)} hours
					</span>
				</p>
				<p className="text-green-700 text-xl">
					Total Amount:{' '}
					<span className="font-semibold">
						${checkoutData.amount.toFixed(2)}
					</span>
				</p>
			</div>

			<div className="border-t border-green-200 pt-4">
				<h4 className="font-medium text-green-800 mb-2">Breakdown</h4>
				<ul className="space-y-2">
					{checkoutData.breakdown.map((segment, index) => (
						<li key={index} className="text-sm text-green-700">
							{new Date(segment.from).toLocaleTimeString()} -{' '}
							{new Date(segment.to).toLocaleTimeString()}:
							<br />
							<span className="ml-4">
								{segment.hours.toFixed(2)}h @ ${segment.rate} (
								{segment.rateMode}) = ${segment.amount.toFixed(2)}
							</span>
						</li>
					))}
				</ul>
			</div>
		</motion.div>
	)
}
