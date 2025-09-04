'use client'
import React, { useState } from 'react'

type Tab = {
	id: string
	label: string
	content?: React.ReactNode
}

type TabsProps = {
	tabs: Tab[]
	defaultTab?: string
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
	const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id)

	return (
		<div>
			<div className="flex border-b mb-6 overflow-x-auto">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						className={`py-2 px-4 font-medium whitespace-nowrap ${
							activeTab === tab.id
								? 'border-b-2 border-red-500 text-red-600'
								: 'text-gray-500'
						}`}
						onClick={() => setActiveTab(tab.id)}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className="mt-4">
				{tabs.find((tab) => tab.id === activeTab)?.content}
			</div>
		</div>
	)
}
