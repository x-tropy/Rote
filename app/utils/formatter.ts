import { Ripeness } from "~/utils/algorithm"

/**
 * Display the time difference between the current time and the given timestamp in days or hours.
 * Example: "2 days" or "15 hours"
 */
const formatDayHour = (timestamp: string | Date) => {
	const duration = Math.abs(Date.now() - Number(timestamp instanceof Date ? timestamp : new Date(timestamp)))
	const hours = Math.floor(duration / (1000 * 60 * 60))
	const days = hours >= 24 ? Math.floor(hours / 24) : 0
	return days ? days + " days" : hours + " hours"
}

type CommonCollectionProps = {
	id: number
	name: string
	ripeness: number
	tags: string[]
	countOvergrownMemos: number
	countMemos: number
	createdAt: Date
}

export type InStoreCollectionProps = CommonCollectionProps & {
	createdBy: string
}

export type OwnedCollectionProps = CommonCollectionProps & {
	timeOfNextExam: Date | null
}

type CommonCoverInfo = {
	id: number
	name: string
	countMemos: number
	progressPercent: number
	collectionRipeness: string
	collectionPhase: number
	tags: string[]
}

export type OwnedCoverInfo = CommonCoverInfo & {
	durationInDays: string
	timeOfNextExam: string
	mode: string
}

export type InStoreCoverInfo = CommonCoverInfo & {
	createdBy: string
	createdAt: string
}

/**
 * Return cover info according to the collection type.
 */
export function formatIntoCoverInfo(collection: InStoreCollectionProps): InStoreCoverInfo
export function formatIntoCoverInfo(collection: OwnedCollectionProps): OwnedCoverInfo
export function formatIntoCoverInfo(collection: InStoreCollectionProps | OwnedCollectionProps): OwnedCoverInfo | InStoreCoverInfo {
	const { id, name, ripeness, tags, countOvergrownMemos, countMemos, createdAt } = collection

	const progressPercent = Math.floor((countOvergrownMemos / countMemos) * 100)
	const collectionRipeness = Ripeness[ripeness].toLowerCase()
	if ("timeOfNextExam" in collection) {
		const formatedTimeOfNextExam = (function () {
			if (!collection.timeOfNextExam) return "(not ready yet)"
			if (collection.timeOfNextExam < new Date()) return "Now"
			return formatDayHour(collection.timeOfNextExam)
		})()
		const mode = collection.timeOfNextExam === null ? "practice" : "exam"
		return {
			id,
			name,
			countMemos,
			progressPercent,
			durationInDays: formatDayHour(createdAt),
			collectionRipeness,
			collectionPhase: ripeness,
			timeOfNextExam: formatedTimeOfNextExam,
			tags,
			mode
		}
	} else {
		const createdBy = collection.createdBy
		return {
			id,
			name,
			countMemos,
			progressPercent,
			collectionRipeness,
			collectionPhase: ripeness,
			tags,
			createdBy,
			createdAt: formatDayHour(createdAt) + " ago"
		}
	}
}
