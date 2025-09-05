export type User = {
	id: string
	username: string
	role: 'admin' | 'employee'
}
export type LoginResponse = {
	user: User
	token: string
}

export type TabContentProps = {
	zones: Zone[]
	selectedZone: string | null
	setSelectedZone: (id: string | null) => void
	onCheckin: () => void
	isCheckingIn: boolean
	subscriptionId?: string
	setSubscriptionId?: (id: string) => void
	verifiedSubscription?: Subscription | null
	handleVerifySubscription?: () => void
}

export type Category = {
	id: string
	name: string
	description: string
	rateNormal: number
	rateSpecial: number
}

export type Zone = {
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

export type Gate = {
	id: string
	name: string
	zoneIds: string[]
	location: string
}

export type Car = {
	plate: string
	brand: string
	model: string
	color: string
}

export type Subscription = {
	id: string
	userName: string
	active: boolean
	category: string
	cars: Car[]
	startsAt: string
	expiresAt: string
	currentCheckins: {
		ticketId: string
		zoneId: string
		checkinAt: string
	}[]
}

export type Ticket = {
	id: string
	type: 'visitor' | 'subscriber'
	zoneId: string
	gateId: string
	checkinAt: string
	checkoutAt?: string
	subscriptionId?: string
}

export type CheckoutResponse = {
	ticketId: string
	checkinAt: string
	checkoutAt: string
	durationHours: number
	breakdown: {
		from: string
		to: string
		hours: number
		rateMode: string
		rate: number
		amount: number
	}[]
	amount: number
	zoneState: Zone
}
export type CheckInResponse = {
	ticket: Ticket
	zoneState: Zone
}
export type RushHour = {
	id: string
	weekDay: number
	from: string
	to: string
}

export type Vacation = {
	id: string
	name: string
	from: string
	to: string
}

export type WsMessage = {
	type: 'zone-update' | 'admin-update'
	payload: {
		specialActive?: boolean
		zoneId?: string
		[key: string]: unknown
		timestamp: number
	}
}
export interface AdminUpdateMessage {
	adminId: string
	action:
		| 'category-rates-changed'
		| 'zone-closed'
		| 'zone-opened'
		| 'vacation-added'
		| 'rush-updated'
	targetType: 'category' | 'zone' | 'vacation' | 'rush'
	targetId: string
	details?: any
	timestamp: string
	receivedAt: string // When the frontend received the message
}
