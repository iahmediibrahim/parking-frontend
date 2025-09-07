import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { VisitorContent } from './VisitorContent'

describe('VisitorContent', () => {
	const props = {
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

	it('renders ZoneGrid and CheckinButton', () => {
		render(<VisitorContent {...props} />)
		expect(screen.getByText('Zone 1')).toBeInTheDocument()
		expect(screen.getByText(/Check In|Processing.../)).toBeInTheDocument()
	})
})
