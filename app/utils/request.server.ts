import { json } from "@remix-run/node"

type StatusType = 400 | 401 | 403 | 404

export function badRequest<T>(data: T, status?: StatusType) {
	return json<T>(data, { status })
}
