import { json, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { getUserId } from "~/utils/session.server"
import { db } from "~/utils/db.server"
import invariant from "tiny-invariant"
import { Main } from "~/components/Container"

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const userId = await getUserId(request)
	if (!userId) {
		return json({ noAccess: true, collectionDetail: null }, { status: 401 })
	}
	const id = Number(params.id)
	const collectionDetail = await db.collection.findUnique({
		include: {
			tags: true,
			memos: true
		},
		where: { id, userId }
	})
	invariant(collectionDetail, "The collection must be present")

	return json({ collectionDetail, noAccess: false })
}

export default function DisplayCollectionRoute() {
	const { collectionDetail, noAccess } = useLoaderData<typeof loader>()

	return (
		<Main noAccess={noAccess}>
			<h1>{collectionDetail?.name}</h1>
			<p>Tags: {collectionDetail?.tags.map(tag => tag.aliase).join(", ")}</p>
			<ul>
				{collectionDetail?.memos.map(memo => (
					<li key={memo.id}>
						* {memo.title} - {memo.cue} - {memo.answer}
					</li>
				))}
			</ul>
		</Main>
	)
}
