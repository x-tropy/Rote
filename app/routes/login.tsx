import { FormGroup, InputGroup, Tooltip, Button, Card, Elevation, Checkbox, AnchorButton, Icon } from "@blueprintjs/core"
import { ActionFunctionArgs } from "@remix-run/node"
import { Form, Link, json, useActionData } from "@remix-run/react"
import { useState } from "react"
import { login } from "~/utils/session.server"

export const action = async ({ request }: ActionFunctionArgs) => {
	const form = await request.formData()
	for (const iterator of form) {
		console.log("\n>>>>>>>>\n", { iterator }, "\n<<<<<<<<\n")
	}
	const name = String(form.get("name"))
	const password = String(form.get("password"))
	const userCredentials = await login({ name, password })
	return json({ msg: userCredentials ? "Login successful" : "Invalid user", userCredentials })
}

export default function Login() {
	let [showPassword, setShowPassowrd] = useState<boolean>(false)

	const revealButton = (
		<Tooltip content={`${showPassword ? "Hide" : "Show"} Password`}>
			<Button icon={showPassword ? "eye-on" : "eye-off"} minimal={true} onClick={() => setShowPassowrd(!showPassword)} />
		</Tooltip>
	)

	// Handle submission feedback
	const data = useActionData<typeof action>()
	console.log("\n>>>>>>>>\n", { data }, "\n<<<<<<<<\n")

	return (
		<Card elevation={Elevation.TWO} className='w-[400px] mx-auto mt-6'>
			{/* Existing user */}
			<Form method='post'>
				<FormGroup label='User name' labelFor='name'>
					<InputGroup required name='name' leftIcon='user' large />
				</FormGroup>
				<FormGroup label='Password' labelFor='password'>
					<InputGroup required name='password' large leftIcon='key' rightElement={revealButton} type={showPassword ? "text" : "password"} />
				</FormGroup>
				<Checkbox label='Remember me' defaultChecked name='rememberMe' />
				<Button intent='primary' fill={true} icon='send-message' type='submit' large>
					Login
				</Button>
			</Form>

			{/* New user */}
			<p className='text-center mt-8'>
				Don't have an account? 
				<Link to='/register' className='pl-4'>
					Register now
					<Icon icon='share' className='pl-2' />
				</Link>
			</p>
		</Card>
	)
}
