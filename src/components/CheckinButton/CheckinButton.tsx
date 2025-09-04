import { PrimaryButton } from '../PrimaryButton'

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
		<PrimaryButton onClick={onClick} disabled={disabled}>
			{isCheckingIn ? 'Processing...' : 'Check In'}
		</PrimaryButton>
	)
}
