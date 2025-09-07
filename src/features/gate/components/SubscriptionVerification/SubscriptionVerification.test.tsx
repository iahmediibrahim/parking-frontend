import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { SubscriptionVerification } from './SubscriptionVerification'

describe('SubscriptionVerification', () => {
	const props = {
		subscriptionId: 'sub1',
		setSubscriptionId: jest.fn(),
		verifiedSubscription: {
			id: 'sub1',
			userName: 'John Doe',
			active: true,
			category: 'cat1',
			cars: [],
			startsAt: '',
			expiresAt: '',
			currentCheckins: [],
		},
		handleVerifySubscription: jest.fn(),
	}

	it('renders input and verify button', () => {
		render(<SubscriptionVerification {...props} />)
		expect(
			screen.getByPlaceholderText('Enter subscription ID'),
		).toBeInTheDocument()
		expect(screen.getByText('Verify')).toBeInTheDocument()
	})

	it('renders subscription details when verifiedSubscription is present', () => {
		render(<SubscriptionVerification {...props} />)
		expect(screen.getByText('Subscription Details')).toBeInTheDocument()
		expect(screen.getByText('John Doe')).toBeInTheDocument()
		expect(screen.getByText('Active')).toBeInTheDocument()
	})

	it('calls setSubscriptionId on input change', () => {
		render(<SubscriptionVerification {...props} />)
		fireEvent.change(screen.getByPlaceholderText('Enter subscription ID'), {
			target: { value: 'sub2' },
		})
		expect(props.setSubscriptionId).toHaveBeenCalledWith('sub2')
	})

	it('calls handleVerifySubscription on button click', () => {
		render(<SubscriptionVerification {...props} />)
		fireEvent.click(screen.getByText('Verify'))
		expect(props.handleVerifySubscription).toHaveBeenCalled()
	})
})
