import GateClient from './GateClient'

// Server Component
export default async function GateScreen({
	params,
}: {
	params: Promise<{ gateId: string }>
}) {
	const { gateId } = await params

	return <GateClient gateId={gateId} />
}
