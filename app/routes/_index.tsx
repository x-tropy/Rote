import type { MetaFunction } from "@remix-run/node"
import type { LinksFunction } from "@remix-run/node"

export const meta: MetaFunction = () => {
	return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }]
}

import crazyStyle from "/styles/index.css?url"

export const links: LinksFunction = () => [
	{
		rel: "stylesheet",
		href: crazyStyle
	}
]

export default function Index() {
	return (
		<div className='text-left'>
			<h1 className='underline text-lime-600'>Welcome to Remix</h1>
			<p className='crazy'>
				sit amet, consectetur adipiscing elit. Sed id consectetur justo. Nullam posuere metus vitae quam consectetur, id bibendum elit pellentesque. Vivamus auctor sodales tortor, nec volutpat ligula.
				Suspendisse potenti. Sed eu lectus nec augue consequat fermentum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse potenti. Quisque luctus,
				nunc eu eleifend ullamcorper, justo purus tristique velit, a tristique odio odio vel augue.
			</p>
			<ul>
				<li>
					<a target='_blank' href='https://remix.run/tutorials/blog' rel='noreferrer'>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					</a>
				</li>
				<li>
					<a target='_blank' href='https://remix.run/tutorials/jokes' rel='noreferrer'>
						D Dive Jokes App Tutorial
					</a>
				</li>
				<li>
					<a target='_blank' href='https://remix.run/docs' rel='noreferrer'>
						Remix Docs
					</a>
				</li>
			</ul>
		</div>
	)
}
