export interface User {
	id: string
	username: string
	role: 'admin' | 'employee'
}

export interface Category {
	id: string
	name: string
	description: string
	rateNormal: number
	rateSpecial: number
}

export interface Zone {
	id: string
	name: string
	categoryId: string
	gateIds: string[]
	totalSlots: number
	occupied: number
	free: number
	reserved: number
	availableForVisitors: number
	availableForSubscribers: number
	rateNormal: number
	rateSpecial: number
	open: boolean
}

export interface Gate {
	id: string
	name: string
	zoneIds: string[]
	location: string
}

export interface Subscription {
	id: string
	userName: string
	active: boolean
	category: string
	cars: Array<{
		plate: string
		brand: string
		model: string
		color: string
	}>
	startsAt: string
	expiresAt: string
	currentCheckins: Array<{
		ticketId: string
		zoneId: string
		checkinAt: string
	}>
}

export interface Ticket {
	id: string
	type: 'visitor' | 'subscriber'
	zoneId: string
	gateId: string
	checkinAt: string
	checkoutAt?: string
	subscriptionId?: string
}

export interface CheckoutResponse {
	ticketId: string
	checkinAt: string
	checkoutAt: string
	durationHours: number
	breakdown: Array<{
		from: string
		to: string
		hours: number
		rateMode: string
		rate: number
		amount: number
	}>
	amount: number
	zoneState: Zone
}

export interface RushHour {
	id: string
	weekDay: number
	from: string
	to: string
}

export interface Vacation {
	id: string
	name: string
	from: string
	to: string
}

export interface WsMessage {
	type: 'zone-update' | 'admin-update'
	payload: any
}
