interface PrimaryButtonProps {
	onClick?: () => void
	disabled?: boolean
	children: React.ReactNode
	type?: 'submit' | 'button'
}

export function PrimaryButton({
	onClick,
	disabled = false,
	children,
	type = 'button',
}: PrimaryButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className="px-6 py-2.5 text-white bg-[#ef4937] rounded-lg cursor-pointer hover:bg-[#d43a2a] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm font-medium"
		>
			{children}
		</button>
	)
}
