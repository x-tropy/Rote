import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node"
import { userSettings } from "~/utils/cookies.server"
import { Form, useLoaderData } from "@remix-run/react"

// 📝 获取到当前的设置，没有则给个默认值
export async function loader({ request }: LoaderFunctionArgs) {
	const cookieHeader = request.headers.get("Cookie")
	const cookie = (await userSettings.parse(cookieHeader)) || {}
	return json({
		language: cookie.language || "en"
	})
}

// 📝 处理用户所提交的新设置（以表单形式传递）
export async function action({ request }: ActionFunctionArgs) {
	const data = await request.formData()
	const language = data.get("language")

	// 📝 在当前 Cookie 的基础之上作修改
	const cookieHeader = request.headers.get("Cookie")
	const cookie = (await userSettings.parse(cookieHeader)) || {}
	cookie.language = language

	// 📝 重定向到首页，带着新的 cookie
	return redirect(".", {
		headers: {
			"Set-Cookie": await userSettings.serialize(cookie)
		}
	})
}

export default function Setting() {
	const { language } = useLoaderData<typeof loader>()
	return (
		<div>
			<h1>Setting</h1>
			<Form method='post'>
				<label>
					<p>
						Current language is: <span>{language}</span>
					</p>
					<select name='language'>
						<option value='en'>English</option>
						<option value='zh'>中文</option>
						<option value='fr'>French</option>
						<option value='nl'>Netherlands</option>
					</select>
				</label>
				<button type='submit'>Save</button>
			</Form>
		</div>
	)
}
