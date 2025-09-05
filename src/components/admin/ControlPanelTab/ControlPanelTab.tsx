'use client'

import React from 'react'
import { ZonesPanel } from '../ZonesPanel'
import { CategoriesPanel } from '../CategoriesPanel'
import { RushHoursPanel } from '../RushHoursPanel'
import { VacationsPanel } from '../VacationsPanel'
import { Tabs } from '@/components/Tabs'

export function ControlPanelTab() {
	const tabs = [
		{
			id: 'zones',
			label: 'Zones',
			content: <ZonesPanel />,
		},
		{
			id: 'categories',
			label: 'Categories',
			content: <CategoriesPanel />,
		},
		{
			id: 'rush-hours',
			label: 'Rush Hours',
			content: <RushHoursPanel />,
		},
		{
			id: 'vacations',
			label: 'Vacations',
			content: <VacationsPanel />,
		},
	]

	return (
		<div>
			<h2 className="text-xl font-semibold mb-4">Control Panel</h2>
			<Tabs tabs={tabs} defaultTab="zones" />
		</div>
	)
}
