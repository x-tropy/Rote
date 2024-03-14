import { userSettings } from "~/utils/cookies.server"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

// 📝 获取到当前的设置，没有则给个默认值
export async function loader({ request }: LoaderFunctionArgs) {
	const cookieHeader = request.headers.get("Cookie")
	const cookie = (await userSettings.parse(cookieHeader)) || {}
	return json({
		language: cookie.language || "en"
	})
}

export default function Language() {
	const { language } = useLoaderData<typeof loader>()

	function text() {
		switch (language) {
			case "en":
				return <h1>English</h1>
			case "zh":
				return <h1>中文</h1>
			case "fr":
				return <h1>French</h1>
			case "nl":
				return <h1>Netherlands</h1>
		}
	}

	return <>{text()}</>
}
