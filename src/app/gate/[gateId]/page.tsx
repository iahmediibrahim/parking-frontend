import GateClient from './GateClient'

// Server Component
export default async function GateScreen({
	params,
}: {
	params: { gateId: string }
}) {
	const { gateId } = params

	return <GateClient gateId={gateId} />
}
