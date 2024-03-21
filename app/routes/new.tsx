import { ActionFunctionArgs, redirect } from "@remix-run/node"
import { db } from "~/utils/db.server"
import { badRequest } from "~/utils/request.server"
import { requireUserId } from "~/utils/session.server"
import invariant from "tiny-invariant"
import { Form } from "@remix-run/react"
import { Button, FormGroup, Icon, InputGroup, TextArea, Switch, Divider } from "@blueprintjs/core"
import { useState } from "react"
import * as React from "react"
import { Main } from "~/components/Container"
import { MyMultiSelect } from "~/components/ReceiveInput"

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
	const tags = formData.get("tags")
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
	// const collection = await db.collection.create({
	// 	data: {
	// 		userId,
	// 		name: parsed.collectionName && name,
	// 		tags: {
	// 			connectOrCreate: parsed.tags.map(tag => ({ create: { name: tag }, where: { name: tag } }))
	// 		},
	// 		memos: {
	// 			create: parsed.memos.map(memo => ({
	// 				title: memo ? memo.memoTitle : "",
	// 				cue: memo ? memo.cue : "",
	// 				answer: memo ? memo.answer : ""
	// 			}))
	// 		}
	// 	}
	// })
	// return redirect(`/collections/${collection.id}`)
}

export default function NewCollectionRoute() {
	const asterisk = <span className='text-red-500 font-mono'>*</span>
	const contentPlaceholder = `Use markdown to create your collection. For example:

# Collection name

## Memo title

Cue

---

Answer
	`

	// Access control
	const [checked, setChecked] = useState(false)
	const handleSwitch = (checked: boolean) => setChecked(checked)

	// Memo count
	const [memoCount, setMemoCount] = useState(0)
	const handleMemoChange = (value: string) => setMemoCount(value.split(/\n## /).length - 1)

	// Tags

	return (
		<Main>
			<h1 className='text-2xl font-semibold text-slate-600 mt-2 mb-4'>Create new collection</h1>
			<Form
				method='post'
				onKeyDown={e => {
					if (e.key === "Enter") {
						e.preventDefault() // Prevent unintended form submission
					}
				}}
			>
				<FormGroup>
					<InputGroup placeholder='collection name' leftIcon='git-repo' large name='name' />
				</FormGroup>
				<FormGroup label='Memos' labelInfo={asterisk}>
					<TextArea onChange={e => handleMemoChange(e.target.value)} required placeholder={contentPlaceholder} name='content' className='w-[100%] min-h-[400px] text-sm' />
				</FormGroup>
				<FormGroup label='Tags'>
					<MyMultiSelect allowCreate icon='tag' menuItems={["tag11", "tag22", "tag33"]} name='tags' placeholder='Add tags' />
				</FormGroup>
				<FormGroup>
					<Switch label='Share with study mates' onChange={e => handleSwitch(e.target.checked)} />
					<MyMultiSelect allowCreate={false} disabled={!checked} icon='user' menuItems={["Chen", "Liao"]} name='studyMates' placeholder='Add study mates' />
				</FormGroup>
				<div className='mt-8 mb-4'>
					<Button intent='primary' large type='submit' icon='tick'>
						Create collection
					</Button>
					<span className='ml-4 text-slate-400'>
						<Icon icon='inbox-update' /> {memoCount} memos
					</span>
				</div>
			</Form>
		</Main>
	)
}
