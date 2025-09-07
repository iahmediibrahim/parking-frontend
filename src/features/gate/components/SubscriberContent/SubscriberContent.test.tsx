import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { SubscriberContent } from './SubscriberContent'

describe('SubscriberContent', () => {
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
		zones: [
			{
				id: 'zone1',
				name: 'Zone 1',
				categoryId: 'cat1',
				gateIds: ['gate1'],
				totalSlots: 10,
				occupied: 2,
				free: 8,
				reserved: 0,
				availableForVisitors: 5,
				availableForSubscribers: 3,
				rateNormal: 10,
				rateSpecial: 8,
				open: true,
			},
		],
		selectedZone: 'zone1',
		setSelectedZone: jest.fn(),
		onCheckin: jest.fn(),
		isCheckingIn: false,
	}

	it('renders SubscriptionVerification and ZoneGrid', () => {
		render(<SubscriberContent {...props} />)
		expect(screen.getByText('Subscription Details')).toBeInTheDocument()
		expect(screen.getByText('Zone 1')).toBeInTheDocument()
	})

	it('renders CheckinButton', () => {
		render(<SubscriberContent {...props} />)
		expect(screen.getByText(/Check In|Processing.../)).toBeInTheDocument()
	})
})
