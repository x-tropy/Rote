import { Button, ButtonGroup, Icon, Tag, Tooltip } from "@blueprintjs/core"
import { CardTitle } from "~/components/SpiceUp"
import { Link } from "@remix-run/react"
import type { InStoreCoverInfo, OwnedCoverInfo } from "~/utils/formatter"

export const CardAddCollection = () => (
	<div key='last' className='flex flex-col justify-center h-[200px] w-[60%] mx-auto space-y-4'>
		<CardTitle className='text-center' text='Feel Powerful today?' boldText='Powerful' rainbowText='Feel Powerful today?' />
		<ButtonGroup vertical={true} className='space-y-2'>
			<Link to='/new'>
				<Button icon='plus' text='Create collection' intent='primary' />
			</Link>
			<Link to='/discover'>
				<Button icon='search' text='Discover' />
			</Link>
		</ButtonGroup>
	</div>
)

type CoverInfo = InStoreCoverInfo | OwnedCoverInfo

export const CollectionCover = (data: { coverInfo: CoverInfo }) => {
	const { coverInfo } = data
	return (
		<div key={coverInfo.id} className='h-[200px] relative'>
			<Link to={`/collections/${coverInfo.id}`} className='group hover:no-underline text-slate-300 hover:text-slate-400'>
				<Icon id='titleArrow' icon='arrow-right' className='child absolute transition-colors group-hover:opacity-100 opacity-0 right-0 top-0 mt-3 mr-1' />
				<CardTitle className='parent group-hover:bg-slate-100' text={"Learn " + coverInfo.name} rainbowText={coverInfo.name} boldText={coverInfo.name} />
			</Link>
			<ul className='marker:text-sky-400 list-disc  pl-4 space-y-1 text-slate-500 text-base mt-2'>
				<li>
					Memo cards: <b>{coverInfo.countMemos}</b>
				</li>
				{"createdBy" in coverInfo && (
					<li>
						Author: <b>{coverInfo.createdBy}</b>
					</li>
				)}
				<li>
					{"createdBy" in coverInfo ? "Author's " : "Current "} progress:
					<Tooltip content={`Phase ${coverInfo.collectionPhase}: ` + coverInfo.collectionRipeness} position='top'>
						<img className='inline mb-1 mx-2' src={`/img/ripeness/${coverInfo.collectionRipeness}.svg`} width={20} height={20} />
					</Tooltip>
					<b>{coverInfo.progressPercent}%</b>
				</li>
				{"timeOfNextExam" in coverInfo && <li>Next exam: {coverInfo.timeOfNextExam ? <b>{coverInfo.timeOfNextExam}</b> : <span className='text-slate-300'>(not ready yet)</span>}</li>}
				{"durationInDays" in coverInfo && (
					<li>
						Duration: <b>{coverInfo.durationInDays} days</b>
					</li>
				)}
				{"createdAt" in coverInfo && (
					<li>
						Created at: <b>{coverInfo.createdAt}</b>
					</li>
				)}
			</ul>
			<p className='mt-4 flex flex-row space-x-2'>
				{coverInfo.tags.map(tag => (
					<Tag key={tag} minimal={true} round intent='primary'>
						{tag}
					</Tag>
				))}
			</p>
			{"mode" in coverInfo ? (
				<Link to={`/collections/${coverInfo.id}?mode=${coverInfo.mode}`}>
					{coverInfo.mode === "practice" ? (
						<Button icon='play' text='Quickstart' intent='primary' className='absolute right-0 bottom-0' />
					) : (
						<Button icon='notifications' text='Take Exam' intent='danger' className='absolute right-0 bottom-0' />
					)}
				</Link>
			) : (
				<Button icon='duplicate' text='Copy collection' intent='success' className='absolute right-0 bottom-0' />
			)}
		</div>
	)
}
