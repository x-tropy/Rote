import { json, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { getUserId } from "~/utils/session.server"
import { db } from "~/utils/db.server"
import invariant from "tiny-invariant"
import { Card } from "@blueprintjs/core"

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const userId = await getUserId(request)
	invariant(userId, "The user id must be present")
	const id = Number(params.id)
	const collectionData = await db.collection.findUnique({
		include: {
			tags: true,
			memos: true
		},
		where: { id, userId }
	})
	invariant(collectionData, "The collection must be present")

	return json({ collectionData })
}

export default function DisplayCollectionRoute() {
	const { collectionData } = useLoaderData<typeof loader>()

	return (
		<Card className='mt-8 w-[100%] mx-auto'>
			<h1>{collectionData.name}</h1>
			<p>Tags: {collectionData.tags.map(tag => tag.aliase).join(", ")}</p>
			<ul>
				{collectionData.memos.map(memo => (
					<li key={memo.id}>
						* {memo.title} - {memo.cue} - {memo.answer}
					</li>
				))}
			</ul>
		</Card>
	)
}
