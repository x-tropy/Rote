import { createCookie } from "@remix-run/node"

export const userSettings = createCookie("user-settings", {
	maxAge: 60 // 1 minute
})
