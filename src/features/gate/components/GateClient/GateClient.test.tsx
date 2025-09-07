import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { GateClient } from './GateClient'

// Mock dependencies
jest.mock('../../hooks', () => ({
	useGateWebSocket: () => ({ isConnected: true, messages: [] }),
}))
let useZonesMock = () => ({
	data: [
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
	isLoading: false,
	error: null,
	refetch: jest.fn(),
})
jest.mock('@/shared', () => ({
	useZones: (...args: unknown[]) => useZonesMock(...args),
	useCheckin: () => ({ mutate: jest.fn(), isPending: false }),
	useSubscription: () => ({ refetch: jest.fn(), error: null }),
	Loader: () => <div>Loading...</div>,
	Tabs: ({
		tabs,
	}: {
		tabs: Array<{ id: string; content: React.ReactNode }>
	}) => (
		<div>
			{tabs.map((tab: { id: string; content: React.ReactNode }) => (
				<div key={tab.id}>{tab.content}</div>
			))}
		</div>
	),
}))
jest.mock('react-hot-toast', () => ({ success: jest.fn(), error: jest.fn() }))

// Minimal PrintableTicket mock
jest.mock('../PrintableTicket', () => ({
	PrintableTicket: ({ showTicket }: { showTicket: boolean }) =>
		showTicket ? <div>Ticket Printed</div> : null,
}))

// Minimal SubscriberContent and VisitorContent mocks
jest.mock('../SubscriberContent', () => ({
	SubscriberContent: () => <div>Subscriber Tab</div>,
}))
jest.mock('../VisitorContent', () => ({
	VisitorContent: () => <div>Visitor Tab</div>,
}))

describe('GateClient', () => {
	it('renders gate info and tabs', () => {
		render(<GateClient gateId="gate1" />)
		const gateHeaders = screen.getAllByText(
			(content) => content.includes('Gate:') && content.includes('gate1'),
		)
		expect(gateHeaders.length).toBeGreaterThan(0)
		const connectedLabels = screen.getAllByText('Connected')
		expect(connectedLabels.length).toBeGreaterThan(0)
		const subscriberTabs = screen.getAllByText('Subscriber Tab')
		expect(subscriberTabs.length).toBeGreaterThan(0)
		const visitorTabs = screen.getAllByText('Visitor Tab')
		expect(visitorTabs.length).toBeGreaterThan(0)
	})

	it('shows error message when error occurs', () => {
		useZonesMock = () => ({
			data: null,
			isLoading: false,
			error: { message: 'Failed to load zones' },
			refetch: jest.fn(),
		})
		render(<GateClient gateId="gate1" />)
		expect(
			screen.getByText(
				(content) =>
					content.includes('Error loading zones:') &&
					content.includes('Failed to load zones'),
			),
		).toBeInTheDocument()
	})

	it('shows loader when loading', () => {
		useZonesMock = () => ({
			data: null,
			isLoading: true,
			error: null,
			refetch: jest.fn(),
		})
		render(<GateClient gateId="gate1" />)
		expect(screen.getByText('Loading...')).toBeInTheDocument()
	})

	beforeEach(() => {
		useZonesMock = () => ({
			data: [
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
			isLoading: false,
			error: null,
			refetch: jest.fn(),
		})
	})
	const { rerender } = render(<GateClient gateId="gate1" />)
	rerender(<GateClient gateId="gate1" />)
	expect(
		screen.getByText(
			(content) => content.includes('Gate:') && content.includes('gate1'),
		),
	).toBeInTheDocument()
	expect(screen.getByText('Connected')).toBeInTheDocument()
	expect(screen.getByText(/Visitor Tab/)).toBeInTheDocument()
	expect(screen.getByText(/Subscriber Tab/)).toBeInTheDocument()
})
