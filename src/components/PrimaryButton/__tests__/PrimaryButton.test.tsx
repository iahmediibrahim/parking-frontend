import { render, screen, fireEvent } from '@testing-library/react'
import { PrimaryButton } from '../PrimaryButton'

describe('PrimaryButton', () => {
	it('renders correctly', () => {
		render(<PrimaryButton>Click me</PrimaryButton>)
		expect(screen.getByText('Click me')).toBeTruthy()
	})

	it('calls onClick when clicked', () => {
		const handleClick = jest.fn()
		render(<PrimaryButton onClick={handleClick}>Click me</PrimaryButton>)
		fireEvent.click(screen.getByText('Click me'))
		expect(handleClick).toHaveBeenCalledTimes(1)
	})

	it('is disabled when disabled prop is true', () => {
		render(<PrimaryButton disabled>Click me</PrimaryButton>)
		expect(screen.getByText('Click me')).toBeDisabled()
	})
})
