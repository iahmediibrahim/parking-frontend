interface CheckinButtonProps {
	onClick: () => void
	disabled: boolean
	isCheckingIn: boolean
}

export function CheckinButton({
	onClick,
	disabled,
	isCheckingIn,
}: CheckinButtonProps) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className="px-6 py-2 btn-primary rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
		>
			{isCheckingIn ? 'Processing...' : 'Check In'}
		</button>
	)
}
