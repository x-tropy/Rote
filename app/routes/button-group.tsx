import { ButtonGroup, Card, Elevation, Button, AnchorButton } from "@blueprintjs/core"

export default function App() {
	return (
		<Card interactive={true} elevation={Elevation.TWO} className='m-5 mx-auto w-[500px]'>
			<ButtonGroup minimal={true}>
				<Button icon='database'>Queries</Button>
				<Button icon='function'>Functions</Button>
				<AnchorButton rightIcon='caret-down'>Options</AnchorButton>
			</ButtonGroup>
		</Card>
	)
}
