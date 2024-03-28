import { Card, Elevation } from "@blueprintjs/core"
import { NoAccessState } from "~/components/SpiceUp"
import React, { ReactNode } from "react"

interface MainContainerProps {
	children: ReactNode[] | ReactNode
	noAccess?: boolean
	columns?: number
	layout: "grid" | "flex"
}

function renderChildren(children: ReactNode[] | ReactNode) {
	if (!children) return null
	if (!Array.isArray(children)) return <Card elevation={Elevation.TWO}>{children}</Card>
	return children.map((child, index) => (
		<Card key={index} elevation={Elevation.TWO}>
			{child}
		</Card>
	))
}

function flexWrapper(children: ReactNode[] | ReactNode) {
	return <div className='my-20 mx-auto w-[700px] flex flex-col space-y-4'>{renderChildren(children)}</div>
}

export const Main: React.FC<MainContainerProps> = ({ children, noAccess, columns = 1, layout = "grid" }) => {
	if (noAccess) {
		return flexWrapper(NoAccessState)
	}
	if (layout === "flex") {
		return flexWrapper(children)
	}

	if (layout === "grid") {
		return <div className={`my-20 mx-auto w-[900px] grid grid-cols-${columns} gap-4`}>{renderChildren(children)}</div>
	}
}
