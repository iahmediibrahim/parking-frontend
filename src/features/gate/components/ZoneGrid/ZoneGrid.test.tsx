import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { ZoneGrid } from './ZoneGrid'

describe('ZoneGrid', () => {
	const zones = [
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
	]

	it('renders zone details and handles selection', () => {
		const setSelectedZone = jest.fn()
		render(
			<ZoneGrid
				zones={zones}
				selectedZone={null}
				setSelectedZone={setSelectedZone}
				type="visitor"
			/>,
		)
		expect(screen.getByText('Zone 1')).toBeInTheDocument()
		fireEvent.click(screen.getByText('Zone 1'))
		expect(setSelectedZone).toHaveBeenCalledWith('zone1')
	})

	it('shows correct availability and rates', () => {
		render(
			<ZoneGrid
				zones={zones}
				selectedZone={null}
				setSelectedZone={jest.fn()}
				type="visitor"
			/>,
		)
		expect(screen.getByText('8 / 10')).toBeInTheDocument()
		expect(screen.getByText('$10')).toBeInTheDocument()
		expect(screen.getByText('$8')).toBeInTheDocument()
	})
})
