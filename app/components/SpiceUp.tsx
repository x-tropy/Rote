import { Button, ButtonGroup, NonIdealState } from "@blueprintjs/core"
import { Link } from "@remix-run/react"

interface CardTitleType {
	text: string
	boldText?: string
	rainbowText?: string
	className?: string
}

export const CardTitle = ({ text, boldText = "", rainbowText = "", className = "" }: CardTitleType) => {
	const highlights = []
	// ※ rainbow style should have higher priority
	if (rainbowText) {
		const style = gradientClasses(pickGradientColors(rainbowText))
		highlights.push({ fragment: rainbowText, style })
	}
	if (boldText) {
		highlights.push({ fragment: boldText, style: "font-bold" })
	}
	const wrappedText = wrapHighlightsWithSpan(text, highlights)
	return <h1 className={className + " transition-colors text-2xl font-regular p-1 truncate ..."} dangerouslySetInnerHTML={{ __html: wrappedText }}></h1>
}

type WrapHighlightsType = {
	text: string
	highlights: {
		fragment: string
		style: string
	}[]
}

const wrapHighlightsWithSpan = (text: string, highlights: WrapHighlightsType["highlights"]) => {
	let result = text
	for (const highlight of highlights) {
		result = result.replaceAll(highlight.fragment, `<span class="${highlight.style}">${highlight.fragment}</span>`)
	}
	return result
}

const colors = ["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"]

const pickGradientColors = (text: string) => {
	const length = text.length
	const firstCharCode = text.charCodeAt(0)
	const colorStopsCount = Math.ceil(length / 4)
	const firstColorIndex = (firstCharCode - 5) % colors.length
	let selectedColors = [colors[firstColorIndex]]
	for (let i = 1; i < colorStopsCount; i++) {
		selectedColors.push(colors[(firstColorIndex + i) % colors.length])
	}
	return selectedColors
}

const gradientClasses = (colors: string[]) => {
	const viaColors = []
	for (let i = 1; i < colors.length - 1; i++) {
		viaColors.push(`via-${colors[i]}-500`)
	}
	let gradient = `from-${colors[0]}-500 ${viaColors.join(" ")} to-${colors[colors.length - 1]}-500`
	return `bg-gradient-to-r text-transparent bg-clip-text ${gradient}`
}

export const NoAccessState = (
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

export const Asterisk = <span className='text-red-500 font-mono'>*</span>
