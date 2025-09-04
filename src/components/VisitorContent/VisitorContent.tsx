import { TabContentProps } from '@/types'
import { CheckinButton } from '../CheckinButton'
import { ZoneGrid } from '../ZoneGrid'

export function VisitorContent({
	zones,
	selectedZone,
	setSelectedZone,
	onCheckin,
	isCheckingIn,
}: TabContentProps) {
	return (
		<div className="space-y-6">
			<ZoneGrid
				zones={zones}
				selectedZone={selectedZone}
				setSelectedZone={setSelectedZone}
				type="visitor"
			/>
			<div className="flex justify-end">
				<CheckinButton
					onClick={onCheckin}
					disabled={!selectedZone || isCheckingIn}
					isCheckingIn={isCheckingIn}
				/>
			</div>
		</div>
	)
}
