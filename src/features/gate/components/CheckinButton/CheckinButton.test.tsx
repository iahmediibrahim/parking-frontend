import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { CheckinButton } from './CheckinButton'

describe('CheckinButton', () => {
	it('renders with correct text when not checking in', () => {
		render(
			<CheckinButton
				onClick={jest.fn()}
				disabled={false}
				isCheckingIn={false}
			/>,
		)
		expect(screen.getByText('Check In')).toBeInTheDocument()
	})

	it('renders with correct text when checking in', () => {
		render(
			<CheckinButton
				onClick={jest.fn()}
				disabled={false}
				isCheckingIn={true}
			/>,
		)
		expect(screen.getByText('Processing...')).toBeInTheDocument()
	})

	it('calls onClick when clicked', () => {
		const onClick = jest.fn()
		render(
			<CheckinButton onClick={onClick} disabled={false} isCheckingIn={false} />,
		)
		fireEvent.click(screen.getByText('Check In'))
		expect(onClick).toHaveBeenCalled()
	})

	it('is disabled when disabled prop is true', () => {
		render(
			<CheckinButton
				onClick={jest.fn()}
				disabled={true}
				isCheckingIn={false}
			/>,
		)
		expect(screen.getByRole('button')).toBeDisabled()
	})
})
