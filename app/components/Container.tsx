import { Card, Elevation, NonIdealState, Button, Divider, ButtonGroup } from "@blueprintjs/core"
import { Link } from "@remix-run/react"
import React, { ReactNode } from "react"

interface MainContainerProps {
	children: ReactNode[]
	noAccess?: boolean
	columns?: number
}

const CLASS_SINGLE_COLUMN = "my-20 mx-auto w-[700px]"
const CLASS_TWO_COLUMNS = "my-20 mx-auto w-[800px] grid grid-cols-2 gap-4"

export const Main: React.FC<MainContainerProps> = ({ children, noAccess, columns = 1 }) => {
	return noAccess || columns === 1 ? (
		<Card className={CLASS_SINGLE_COLUMN} elevation={Elevation.TWO}>
			{!noAccess ? children : NoAccessState}
		</Card>
	) : (
		<div className={CLASS_TWO_COLUMNS}>
			{children.map((child, index) => (
				<Card key={index} elevation={Elevation.TWO}>
					{child}
				</Card>
			))}
		</div>
	)
}

const NoAccessState = (
	<NonIdealState
		className='py-40'
		title='Access Denied'
		description={
			<div>
				You do not have access to this page.
				<br />
				Please login or register first.
			</div>
		}
		icon='blocked-person'
		action={
			<ButtonGroup vertical={false} className='flex flex-row space-x-4'>
				<Link to={"/login"}>
					<Button text='Login' icon='log-in' intent='none' />
				</Link>
				<Link to={"/register"}>
					<Button text='Register' icon='new-person' intent='none' />
				</Link>
			</ButtonGroup>
		}
	/>
)
