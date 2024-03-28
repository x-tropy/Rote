import { LoaderFunctionArgs, json } from "@remix-run/node"
import { Main } from "~/components/Container"
import { requireUserId } from "~/utils/session.server"
import { db } from "~/utils/db.server"
import { useLoaderData } from "@remix-run/react"
import { CollectionCover } from "~/components/DisplayOutput"
import { formatIntoCoverInfo } from "~/utils/formatter"
import type { InStoreCollectionProps, InStoreCoverInfo } from "~/utils/formatter"

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await requireUserId(request)

	const collections = await db.collection.findMany({
		where: {
			accesses: {
				some: {
					userId: userId
				}
			}
		},
		include: { memos: { include: { progress: true } }, tags: true, user: true }
	})
	const coversInfo = collections.map((collection): InStoreCoverInfo => {
		const { id, name, ripeness, tags, memos, createdAt, user } = collection
		const countMemos = memos.length
		const countOvergrownMemos = memos.filter(memo => {
			const { progress } = memo
			return progress && progress.ripeness > ripeness
		}).length
		const inStoreCollection: InStoreCollectionProps = {
			id,
			name,
			ripeness,
			tags: tags.map(tag => tag.name),
			createdBy: user.name,
			countOvergrownMemos,
			countMemos,
			createdAt
		}
		return formatIntoCoverInfo(inStoreCollection)
	})

	return json({ coversInfo })
}

export default function DiscoverRoute() {
	const { coversInfo } = useLoaderData<typeof loader>()
	const covers = coversInfo.map((coverInfo: InStoreCoverInfo) => <CollectionCover key={coverInfo.id} coverInfo={coverInfo} />)
	return (
		<Main layout='grid' columns={2}>
			{covers}
		</Main>
	)
}
