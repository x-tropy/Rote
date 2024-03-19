import type { ActionFunctionArgs } from "@remix-run/node"

import { logout } from "~/utils/session.server"

export const loader = async ({ request }: ActionFunctionArgs) => logout(request)
