import { ActionFunctionArgs, redirect } from "@remix-run/node"
import { db } from "~/utils/db.server"
import { badRequest } from "~/utils/request.server"
import { requireUserId } from "~/utils/session.server"
import invariant from "tiny-invariant"
import { marked } from "marked"
import { Form } from "@remix-run/react"
import { Button, Card, Elevation, FormGroup, InputGroup, Label, TextArea } from "@blueprintjs/core"

function parseMarkdown(content: string) {
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

type ParsedMarkdown = ReturnType<typeof parseMarkdown>
let parsed: ParsedMarkdown

function validateContent(name: string, content: string) {
	parsed = parseMarkdown(content)
	if (!parsed) {
		return "Invalid markdown"
	}

	// Either the name or the collection name must be present
	if (!name && !parsed.collectionName) {
		return "Name is required"
	}

	return null
}

// ✨TODO: add share to study mate feature
export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	invariant(userId, "The user id must be present")

	const formData = await request.formData()
	const name = formData.get("name")
	const content = formData.get("content")
	if (typeof name !== "string" || typeof content !== "string") {
		return badRequest({
			fieldErrors: null,
			fields: null,
			formError: "Invalid form data"
		})
	}
	const fieldErrors = {
		content: validateContent(name, content)
	}
	const fields = { name, content }

	// Validation failed
	if (Object.values(fieldErrors).some(Boolean)) {
		return badRequest({ fieldErrors, fields, formError: null })
	}
	invariant(parsed, "The parsed markdown must be present")

	// Save to database
	const collection = await db.collection.create({
		data: {
			userId,
			name: parsed.collectionName,
			tags: {
				connectOrCreate: parsed.tags.map(tag => ({ create: { name: tag }, where: { name: tag } }))
			},
			memos: {
				create: parsed.memos.map(memo => ({
					title: memo ? memo.memoTitle : "",
					cue: memo ? memo.cue : "",
					answer: memo ? memo.answer : ""
				}))
			}
		}
	})
	return redirect(`/collections/${collection.id}`)
}

export default function NewCollectionRoute() {
	const asterisk = <span className='text-red-500 font-mono'>*</span>
	const contentPlaceholder = `---
Tags: German, Vocabulary
...

# German 1000 words

## Wie

提示：常用的德语词汇

---

How

## Wann

used to ask the time

---

When
	`
	return (
		<Card className='mt-8 mx-auto w-[700px]' elevation={Elevation.TWO}>
			<h1 className='text-xl my-4'>New Collection</h1>
			<Form method='post'>
				<FormGroup label='Collection name' labelInfo='(optional)'>
					<InputGroup large name='name' />
				</FormGroup>
				<FormGroup label='Memo cards' labelInfo={asterisk}>
					<TextArea large required placeholder={contentPlaceholder} name='content' className='w-[100%] min-h-[400px] font-mono' />
				</FormGroup>
				<Button large type='submit' icon='add'>
					Create
				</Button>
			</Form>
		</Card>
	)
}
