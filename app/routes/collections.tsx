import { LoaderFunctionArgs, json } from "@remix-run/node"
import { getUserId } from "~/utils/session.server"
import { db } from "~/utils/db.server"
import { Outlet, useLoaderData } from "@remix-run/react"
import { Main } from "~/components/Container"

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await getUserId(request)
	if (!userId) {
		return json({ noAccess: true, collections: [] }, { status: 401 })
	}

	const collections = await db.collection.findMany({
		where: { userId }
	})
	return json({ collections, noAccess: false })
}

export default function DisplayCollectionsRoute() {
	const { collections, noAccess } = useLoaderData<typeof loader>()
	return (
		<Main noAccess={noAccess}>
			<h1>Your Collections</h1>
			<ul>
				{collections.map(collection => (
					<li key={collection.id}>
						<a href={`/collections/${collection.id}`}>{collection.name}</a>
					</li>
				))}
			</ul>
			<Outlet />
		</Main>
	)
}
