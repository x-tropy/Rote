import type { LinksFunction } from "@remix-run/node"
import { Link, Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration, json, useLoaderData } from "@remix-run/react"

// 🧠 the '?url' suffix is crucial!
import tailwind from "/styles/tailwind.css?url"
import blueprint from "/styles/blueprint.css?url"
import { Navbar, Alignment, Button, FocusStyleManager } from "@blueprintjs/core"
import { getUserId } from "./utils/session.server"
import type { LoaderFunctionArgs } from "@remix-run/node"

export const links: LinksFunction = () => [
	{
		rel: "stylesheet",
		href: tailwind
	},
	{
		rel: "stylesheet",
		href: blueprint
	}
]

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await getUserId(request)
	return json({ userId })
}

export function Layout({ children }: { children: React.ReactNode }) {
	const { userId } = useLoaderData<typeof loader>()
	FocusStyleManager.onlyShowFocusOnTabs()
	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<Meta />
				<Links />
			</head>
			{/* Apply lavendar background color with a repeated pattern */}
			<body className="bg-[#c3a2db] bg-repeat bg-[url('/img/pattern.svg')]">
				<Navbar fixedToTop>
					<Navbar.Group align={Alignment.LEFT}>
						<Navbar.Heading>
							<img src='/img/logo-rote.png' className='h-[30px]' />
						</Navbar.Heading>
						<Navbar.Divider />
						<NavLink to='/collections'>
							{({ isActive, isPending }) => <Button minimal loading={isPending} intent={isActive ? "primary" : undefined} icon='new-grid-item' text='My Collections' />}
						</NavLink>
						<NavLink to='/achievement'>{({ isActive, isPending }) => <Button minimal loading={isPending} intent={isActive ? "primary" : undefined} icon='star' text='Achievement' />}</NavLink>
						<NavLink to='/new'>{({ isActive, isPending }) => <Button minimal loading={isPending} intent={isActive ? "primary" : undefined} icon='insert' text='Create' />}</NavLink>
						<NavLink to='/discover'>{({ isActive, isPending }) => <Button minimal loading={isPending} intent={isActive ? "primary" : undefined} icon='shop' text='Discover' />}</NavLink>
					</Navbar.Group>
					<Navbar.Group align={Alignment.RIGHT}>
						{userId ? (
							<>
								<Link to='/me'>
									<Button minimal icon='user' text='Profile' />
								</Link>
								<Link to={"/logout"}>
									<Button minimal intent='danger' icon='log-out' text='Logout' />
								</Link>
							</>
						) : (
							<>
								<Link to={"/register"}>
									<Button minimal icon='new-person' text='Register' />
								</Link>
								<Link to={"/login"}>
									<Button className='ml-2' intent='primary' icon='log-in' text='Login' />
								</Link>
							</>
						)}
					</Navbar.Group>
				</Navbar>
				{children}
				<ScrollRestoration />
				{/* 🔥 LiveReload is not needed anymore */}
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return <Outlet />
}
