import { LoaderFunctionArgs, json } from "@remix-run/node"
import { getUserId } from "~/utils/session.server"
import { db } from "~/utils/db.server"
import { Link, useLoaderData } from "@remix-run/react"
import { Main } from "~/components/Container"
import { CardAddCollection, CollectionCover } from "~/components/DisplayOutput"
import { formatIntoCoverInfo } from "~/utils/formatter"
import type { OwnedCollectionProps, OwnedCoverInfo } from "~/utils/formatter"

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await getUserId(request)
	if (!userId) {
		return json({ noAccess: true, coversInfo: [] }, { status: 401 })
	}
	const collections = await db.collection.findMany({
		where: { userId },
		include: { memos: { include: { progress: true } }, tags: true }
	})
	const coversInfo = collections.map(collection => {
		const { id, name, ripeness, tags, memos, createdAt, timeOfNextExam } = collection
		const countMemos = memos.length
		const countOvergrownMemos = memos.filter(memo => {
			const { progress } = memo
			return progress && progress.ripeness > ripeness
		}).length
		const ownedCollection: OwnedCollectionProps = {
			id,
			name,
			ripeness,
			tags: tags.map(tag => tag.name),
			timeOfNextExam,
			countOvergrownMemos,
			countMemos,
			createdAt
		}
		return formatIntoCoverInfo(ownedCollection)
	})

	return json({ coversInfo, noAccess: false })
}

export default function DisplayCollectionsRoute() {
	const { coversInfo, noAccess } = useLoaderData<typeof loader>()
	const covers = coversInfo.map((coverInfo: OwnedCoverInfo) => <CollectionCover key={coverInfo.id} coverInfo={coverInfo} />)
	covers.push(<CardAddCollection key='last' />)
	return (
		<Main noAccess={noAccess} layout='grid' columns={2}>
			{covers}
		</Main>
	)
}
