import type { MetaFunction } from "@remix-run/node"
import type { LinksFunction } from "@remix-run/node"

export const meta: MetaFunction = () => {
	return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }]
}

// 📝 any route page can have there own stylesheet
import customStyle from "/styles/index.css?url"

export const links: LinksFunction = () => [
	{
		rel: "stylesheet",
		href: customStyle
	}
]

export default function Index() {
	return <h1 className='text-2xl'>Index</h1>
}
