import { db } from "./db.server"
import bcrypt from "bcrypt"

type LoginForm = {
	name: string
	password: string
}

// ※ Handle login, return user's id and name if login is successful
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
