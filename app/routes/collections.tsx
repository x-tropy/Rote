import { LoaderFunctionArgs, json } from "@remix-run/node"
import { getUserId } from "~/utils/session.server"
import { db } from "~/utils/db.server"
import { Outlet, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { Card } from "@blueprintjs/core"

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await getUserId(request)
	invariant(userId, "The user id must be present")
	const collections = await db.collection.findMany({
		where: { userId }
	})
	return json({ collections })
}

export default function DisplayCollectionsRoute() {
	const { collections } = useLoaderData<typeof loader>()
	return (
		<Card className='mt-8 w-[700px] mx-auto'>
			<h1>Your Collections</h1>
			<ul>
				{collections.map(collection => (
					<li key={collection.id}>
						<a href={`/collections/${collection.id}`}>{collection.name}</a>
					</li>
				))}
			</ul>
			<Outlet />
		</Card>
	)
}
