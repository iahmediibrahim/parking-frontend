import { PrimaryButton } from '../PrimaryButton'

interface LookupInputProps<T> {
	value: T
	onChange: (value: T) => void
	onLookup: () => void
	label: string
	placeholder: string
	disabled: boolean
	btnText: string
}

export function LookupInput<T>({
	value,
	onChange,
	onLookup,
	label,
	placeholder,
	disabled,
	btnText,
}: LookupInputProps<T>) {
	return (
		<div className="mb-6 mx-4">
			<label className="block text-sm font-medium text-gray-700 mb-2">
				{label}
			</label>
			<div className="flex gap-3">
				<input
					type="text"
					value={value as string}
					onChange={(e) => onChange(e.target.value as unknown as T)}
					className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
					placeholder={placeholder}
				/>
				<PrimaryButton onClick={onLookup} disabled={disabled || !value}>
					{btnText}
				</PrimaryButton>
			</div>
		</div>
	)
}
