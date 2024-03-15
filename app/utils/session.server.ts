import { redirect, createCookieSessionStorage } from "@remix-run/node"
import { db } from "./db.server"
import bcrypt from "bcryptjs"

// 📝 create cookie session
const SESSION_SECRET = process.env.SESSION_SECRET
if (!SESSION_SECRET) {
	throw new Error("SESSION_SECRET is not set")
}

const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: "Rote_Session",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		secrets: [SESSION_SECRET],
		maxAge: 60 * 60 * 24 * 30, // 30 days
		path: "/"
	}
})

// 🚩 Handle user login, shall be used by 📜 Login page
export async function createUserSession(userId: string, redirectTo: string) {
	const session = await sessionStorage.getSession()
	session.set("userId", userId)
	return redirect(redirectTo, {
		headers: {
			"Set-Cookie": await sessionStorage.commitSession(session)
		}
	})
}

/* ※ Extract user id from session */
function getUserSession(request: Request) {
	return sessionStorage.getSession(request.headers.get("Cookie"))
}

export async function getUserId(request: Request) {
	const session = await getUserSession(request)
	const userId = session.get("userId")
	if (!userId || typeof userId !== "string") {
		return null
	}
	return userId
}

/* 
	※ Redirect to 📜 login page, if user id is not found. 
	※ Will finally come back with valid user id.
*/
export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
	const session = await getUserSession(request)
	const userId = session.get("userId")
	if (!userId || typeof userId !== "string") {
		/*※ The tail, telling where am I from 
			※ Throw it, don't return!
		*/
		throw redirect(`/login?redirectTo=${new URLSearchParams([["redirectTo", redirectTo]])}`)
	}

	return userId
}

type LoginForm = {
	name: string
	password: string
}

/* ※ Handle login, return user's id and name if login is successful */
export async function login({ name, password }: LoginForm) {
	const user = await db.user.findUnique({
		where: { name }
	})

	if (!user) {
		return null
	}

	const isPasswordMatch = await bcrypt.compare(password, user.passwordHash)
	if (!isPasswordMatch) {
		return null
	}

	return {
		id: user.id,
		name
	}
}
