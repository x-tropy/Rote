import { Card, Elevation } from "@blueprintjs/core"
import { NoAccessState } from "~/components/SpiceUp"
import React, { ReactNode } from "react"

interface MainContainerProps {
	children: ReactNode[]
	noAccess?: boolean
	columns?: number
}

export const Main: React.FC<MainContainerProps> = ({ children, noAccess, columns = 1 }) => {
	return noAccess || columns === 1 ? (
		<Card className={"my-20 mx-auto w-[800px]"} elevation={Elevation.TWO}>
			{!noAccess ? children : NoAccessState}
		</Card>
	) : (
		<div className={"my-20 mx-auto w-[900px] grid grid-cols-2 gap-4"}>
			{children.map((child, index) => (
				<Card key={index} elevation={Elevation.TWO}>
					{child}
				</Card>
			))}
		</div>
	)
}
