import { render, screen } from '@testing-library/react'
import { PrintableTicket } from './PrintableTicket'

describe('PrintableTicket', () => {
	const ticketData = {
		id: 'ticket1',
		type: 'visitor' as const,
		zoneId: 'zone1',
		gateId: 'gate1',
		checkinAt: '2023-01-01T12:00:00Z',
	}

	it('renders ticket details when showTicket is true', () => {
		render(
			<PrintableTicket
				showTicket={true}
				setShowTicket={jest.fn()}
				ticketData={ticketData}
			/>,
		)
		expect(screen.getByText('Parking Ticket')).toBeInTheDocument()
		expect(screen.getByText('ticket1')).toBeInTheDocument()
		expect(screen.getByText('visitor')).toBeInTheDocument()
		expect(screen.getByText('zone1')).toBeInTheDocument()
		expect(screen.getByText('gate1')).toBeInTheDocument()
		const formattedDate = new Date(ticketData.checkinAt).toLocaleString()
		expect(screen.getByText(formattedDate)).toBeInTheDocument()
	})

	it('does not render ticket details when showTicket is false', () => {
		render(
			<PrintableTicket
				showTicket={false}
				setShowTicket={jest.fn()}
				ticketData={ticketData}
			/>,
		)
		expect(screen.queryByText('Parking Ticket')).not.toBeInTheDocument()
	})
})
