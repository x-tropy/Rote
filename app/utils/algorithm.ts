/**
 * To mark the score of each attempt.
 * 'LevelUp' is an extra score to mark the upgradation of a memo.
 */
export enum Score {
	Perfect = 2,
	Correct = 1,
	GaveUp = 0,
	Wrong = -1,
	LevelUp = 9
}

/**
 * To mark the ripeness of a memo or a collection
 */
export enum Ripeness {
	Seedling,
	Green,
	Yellow,
	Red,
	Rotten,
	Rotten2,
	Rotten3
}

/**
 * To mark the status of a collection, and show it in the cover
 */
export enum CollectionStatus {
	YetToStart,
	PracticeMode,
	ExamMode,
	Mastered
}

interface GetCollectionStatusParams {
	timeOfNextExam: number | null
	ripenessOfMemos: Ripeness[]
	collectionRipeness: Ripeness
}

interface CanUpdateMemoRipenessParams {
	memoRipeness: Ripeness
	collectionRipeness: Ripeness
	isExamMode: boolean
	scoresOfMemo: Score[]
}

/**
 * 'memoRipeness' equals the number of 'LevelUp's in 'scores'
 */
export const getMemoRipeness = (scores: Score[]) => {
	return scores.filter(score => score === Score.LevelUp).length
}

/**
 * 'collectionRipeness' will the smallest ripeness of all memos
 */
export const getCollectionRipeness = (scoresOfMemos: Score[][]) => {
	return scoresOfMemos.reduce((acc, scoresOfMemo) => Math.min(acc, getMemoRipeness(scoresOfMemo)), Infinity)
}

/**
 * Help to determine whether this should be a practice or exam?
 * Only if current date is greater than 'timeOfNextExam', it will be an exam.
 */
export const getCollectionStatus = (params: GetCollectionStatusParams): CollectionStatus => {
	const { timeOfNextExam, ripenessOfMemos, collectionRipeness } = params
	if (ripenessOfMemos.every(r => r === Ripeness.Seedling)) {
		return CollectionStatus.YetToStart
	}
	if (timeOfNextExam && Date.now() > timeOfNextExam) {
		return CollectionStatus.ExamMode
	}
	if (collectionRipeness === Ripeness.Rotten3) {
		return CollectionStatus.Mastered
	}
	return CollectionStatus.PracticeMode
}

/**
 * Time of next exam is calculated based on the following rules:
 * spaced repetition: 1, 7, 16, 35 days for each ripeness
 */
export const getTimeOfNextExam = (collectionRipeness: Ripeness) => {
	const day = 24 * 60 * 60 * 1000
	switch (collectionRipeness) {
		case Ripeness.Red:
			return Date.now() + 7 * day
		case Ripeness.Rotten:
			return Date.now() + 16 * day
		case Ripeness.Rotten2:
			return Date.now() + 35 * day
		default: // Yellow
			return Date.now() + 1 * day
	}
}

/**
 * Memo ripeness can only go ahead of collection ripeness 1 step.
 * If memo ripeness is less than Yellow, it can be updated after a correct answer.
 * If memo ripeness is greater or equal to Yellow, it can only be updated in an exam.
 * If memo ripeness is Yellow, it can be updated after 2 consecutive correct answers to reach Red.
 */
export const canUpdateMemoRipeness = (params: CanUpdateMemoRipenessParams): boolean => {
	const { memoRipeness, collectionRipeness, scoresOfMemo, isExamMode } = params
	if (memoRipeness > collectionRipeness) return false
	if (memoRipeness < Ripeness.Yellow) {
		return scoresOfMemo[scoresOfMemo.length - 1] >= Score.Correct ? true : false
	}
	if (isExamMode) {
		if (memoRipeness === Ripeness.Yellow) {
			const lastTwoScores = scoresOfMemo.slice(-2)
			return lastTwoScores.every(score => score >= Score.Correct) ? true : false
		} else if (memoRipeness > Ripeness.Yellow) {
			return scoresOfMemo[scoresOfMemo.length - 1] >= Score.Correct ? true : false
		}
	}
	return false
}

/**
 * 1. All memos reached the same ripeness.
 * 2. The ripeness of memos is 1 step ahead of the ripeness of the collection.
 */
export const canUpdateCollectionRipeness = (rMemos: Ripeness[], rCollection: Ripeness): boolean => {
	if (rMemos.every(r => r === rMemos[0])) {
		if (rMemos[0] - rCollection == 1) return true
	}
	return false
}

/**
 * test 'canUpdateMemoRipeness' function
 */
const testCanUpdateMemoRipeness = () => {
	const params = {
		memoRipeness: Ripeness.Yellow,
		collectionRipeness: Ripeness.Yellow,
		isExamMode: true,
		scoresOfMemo: [Score.Wrong, Score.Correct, Score.Correct]
	}
	console.log(canUpdateMemoRipeness(params)) // true
}

/**
 * test 'canUpdateCollectionRipeness' function
 */
const testCanUpdateCollectionRipeness = () => {
	const rMemos = [Ripeness.Yellow, Ripeness.Yellow, Ripeness.Yellow]
	const rCollection = Ripeness.Green
	console.log(canUpdateCollectionRipeness(rMemos, rCollection)) // true
}

// testCanUpdateMemoRipeness()
// testCanUpdateCollectionRipeness()

export function parseMarkdown(content: string) {
	const parts = content.split("\n## ")
	// A collection must have at least one memo
	if (parts.length < 2) {
		return null
	}
	const rawFrontMatterAndName = parts[0]
	const rawMemos = parts.slice(1)

	const tagsRegex = /[Tt]ag[s]?:\s*(.*)\s*/
	const tagsMatch = rawFrontMatterAndName.match(tagsRegex)
	const tags = tagsMatch ? tagsMatch[1].split(",").map(tag => tag.trim()) : []

	const titleRegex = /^#\s*(.*)$/m
	const titleMatch = rawFrontMatterAndName.match(titleRegex)
	const collectionName = titleMatch ? titleMatch[1].trim() : ""

	const memos = rawMemos.map(rawMemo => {
		const memoParts = rawMemo.split("\n")
		const memoTitle = memoParts[0]
		const memoContent = memoParts.slice(1).join("\n")

		// memoContent must not be empty
		if (memoContent.trim().length === 0) {
			return null
		}
		const horizontalRuleRegex = /^(?:-{3,})$/gm
		const [cue, answer] = memoContent.split(horizontalRuleRegex)

		// No horizontal rule
		if (!cue && !answer) {
			return { memoTitle, answer: memoContent, cue: "" }
		}

		// A memo may only have an answer and no cue
		if (!cue && answer) {
			return { memoTitle, answer: cue, cue: "" }
		}

		return { memoTitle, cue, answer }
	})

	// A collection must have at least one memo
	if (memos.every(memo => memo === null)) {
		return null
	}

	return { collectionName, tags, memos }
}

export type ParsedMarkdown = ReturnType<typeof parseMarkdown>
