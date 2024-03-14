import type { LinksFunction } from "@remix-run/node"
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react"

// 🧠 the '?url' suffix is crucial!
import tailwind from "/styles/tailwind.css?url"
import blueprint from "/styles/blueprint.css?url"

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

export function Layout({ children }: { children: React.ReactNode }) {
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
