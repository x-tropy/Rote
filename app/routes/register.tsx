import { useState } from "react"
import { Button, Card, Elevation, FormGroup, InputGroup, Checkbox, Tooltip, Icon, Callout } from "@blueprintjs/core"
import { Form, Link, redirect, useActionData, useNavigation } from "@remix-run/react"
import type { ActionFunctionArgs } from "@remix-run/node"
import { db } from "~/utils/db.server"
import { register } from "~/utils/session.server"
import { badRequest } from "~/utils/request.server"

export const action = async ({ request }: ActionFunctionArgs) => {
	const form = await request.formData()
	const name = form.get("name")
	const password = form.get("password")
	const passwordRepeat = form.get("passwordRepeat")
	if (typeof name !== "string" || typeof password !== "string" || typeof passwordRepeat !== "string") {
		return badRequest(
			{
				fieldErrors: null,
				fields: null,
				formError: "Form not submitted correctly."
			},
			400
		)
	}
	const fields = { name, password, passwordRepeat }

	// 🥅 1. name should be unique
	// 🥅 2. two passwords should match
	// 🥅 3. password should be strong enough
	const fieldErrors = {
		password: password.length < 6 ? "Password should be at least 6 characters" : null,
		passwordRepeat: password !== passwordRepeat ? "Passwords do not match" : null,
		name: (await db.user.findUnique({ where: { name } })) ? "User name already exists" : null
	}

	if (Object.values(fieldErrors).some(Boolean)) {
		return badRequest(
			{
				fieldErrors,
				fields,
				formError: null
			},
			400
		)
	}

	// 🥅 4. db failure, failed to create new user
	const user = await register({ name, password })
	if (!user) {
		return badRequest(
			{
				fieldErrors: null,
				fields: null,
				formError: "Failed to create new user, please try again later."
			},
			500
		)
	}
	return null
}

export default function Register() {
	let [showPassword, setShowPassowrd] = useState<boolean>(false)

	const revealButton = (
		<Tooltip content={`${showPassword ? "Hide" : "Show"} Password`}>
			<Button icon={showPassword ? "eye-on" : "eye-off"} minimal={true} onClick={() => setShowPassowrd(!showPassword)} />
		</Tooltip>
	)

	// Handle submission feedback
	const navigation = useNavigation()
	const isSubmitting = navigation.state === "submitting"
	const actionData = useActionData<typeof action>()

	const isIllegalName = actionData?.fieldErrors?.name ? "danger" : undefined
	const isIllegalPassword = actionData?.fieldErrors?.password ? "danger" : undefined
	const isIllegalPasswordRepeat = actionData?.fieldErrors?.passwordRepeat ? "danger" : undefined

	return (
		<Card elevation={Elevation.TWO} className='w-[400px] mx-auto my-20'>
			<img src='/img/logo-rote.png' alt='logo' width={150} className='mx-auto mt-6 mb-1' />
			<p className='text-center text-sm italic text-slate-400 mb-10'>
				Benefit from the beauty of <span className='underline font-bold'>repetition</span>!
			</p>

			{/* Existing user */}
			<Form method='post'>
				<FormGroup label='User name' labelFor='name' helperText={actionData?.fieldErrors?.name} intent={isIllegalName}>
					<InputGroup required name='name' leftIcon='user' large intent={isIllegalName} />
				</FormGroup>
				<FormGroup label='Password' labelFor='password' helperText={actionData?.fieldErrors?.password} intent={isIllegalPassword}>
					<InputGroup required name='password' large leftIcon='key' rightElement={revealButton} type={showPassword ? "text" : "password"} intent={isIllegalPassword} />
				</FormGroup>
				<FormGroup label='Password' labelInfo='(repeat)' labelFor='passwordRepeat' helperText={actionData?.fieldErrors?.passwordRepeat} intent={isIllegalPasswordRepeat}>
					<InputGroup required name='passwordRepeat' large leftIcon='key' rightElement={revealButton} type={showPassword ? "text" : "password"} intent={isIllegalPasswordRepeat} />
				</FormGroup>
				<Button
					intent={actionData === null ? "success" : "primary"}
					fill={true}
					icon={actionData === null ? "tick-circle" : "new-person"}
					type='submit'
					large
					text={actionData === null ? "" : "Register"}
					disabled={isSubmitting || actionData === null}
					loading={isSubmitting}
					className='mb-4'
				/>
				{actionData?.formError && (
					<Callout intent='danger' title='Error' icon='issue'>
						{actionData.formError}
					</Callout>
				)}
				{actionData === null && (
					<Callout intent='success' title='Success' icon='tick-circle'>
						You have successfully registered!
						<Link to={"/login"}>
							<Button intent='success' icon='log-in' text='Login now' />
						</Link>
					</Callout>
				)}
			</Form>

			{/* New user */}
			<p className='text-center mt-8'>
				Already have an account? 
				<Link to='/login' className='pl-4'>
					Login now
					<Icon icon='share' className='pl-2' />
				</Link>
			</p>
		</Card>
	)
}
