import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node"
import { db } from "~/utils/db.server"
import { badRequest } from "~/utils/request.server"
import { getUserId, requireUserId } from "~/utils/session.server"
import invariant from "tiny-invariant"
import { Form, useLoaderData } from "@remix-run/react"
import { Button, FormGroup, Icon, InputGroup, TextArea, Switch } from "@blueprintjs/core"
import { useState } from "react"
import { Main } from "~/components/Container"
import { MyMultiSelect } from "~/components/ReceiveInput"
import { Asterisk } from "~/components/SpiceUp"
import { parseMarkdown, type ParsedMarkdown } from "~/utils/algorithm"

/****************
 * LOADER
 ****************/
export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await getUserId(request)
	if (!userId) {
		return json({ tags: [], studyMates: [], noAccess: true }, { status: 401 })
	}

	// get all tags created by the user
	const tags = await db.tag.findMany({
		select: { name: true }
	})

	// get all users except the current user
	const studyMates = await db.user.findMany({
		where: { id: { not: userId } },
		select: { name: true, id: true }
	})

	return json({ tags, studyMates, noAccess: false })
}

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

/****************
 * ACTION
 ****************/
export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()
	const name = formData.get("name")
	const content = formData.get("content")
	const tags = formData.get("tags")
	const studyMates = formData.get("studyMates")

	// Form validation
	if (typeof name !== "string" || typeof content !== "string" || typeof tags !== "string" || typeof studyMates !== "string") {
		return badRequest({
			fieldErrors: null,
			fields: null,
			formError: "Invalid form data"
		})
	}

	// Field validation
	const fieldErrors = {
		content: validateContent(name, content)
	}
	const fields = { name, content }
	if (Object.values(fieldErrors).some(Boolean)) {
		return badRequest({ fieldErrors, fields, formError: null })
	}
	invariant(parsed, "The parsed markdown must be present")

	// Prepare data
	const selectedTags = tags.split(",").map(tag => tag.trim())
	const mergedTags = Array.from(new Set([...selectedTags, ...parsed.tags]))
	const collectionName = name || parsed.collectionName
	const studyMateNames = studyMates.split(",").map(studyMate => studyMate.trim())
	const studyMateIds = await db.user.findMany({
		where: { name: { in: studyMateNames } },
		select: { id: true }
	})

	// Save to database
	const userId = await requireUserId(request)
	const collection = await db.collection.create({
		data: {
			userId,
			name: collectionName,
			tags: {
				connectOrCreate: mergedTags.map(tag => ({ create: { name: tag }, where: { name: tag } }))
			},
			accesses: {
				create: studyMateIds.map(studyMateId => ({ userId: studyMateId.id }))
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

/****************
 * COMPONENT
 ****************/
export default function NewCollectionRoute() {
	const { tags, studyMates, noAccess } = useLoaderData<typeof loader>()
	const tagItems = tags.map(tag => tag.name)
	const studyMateItems = studyMates.map(user => user.name)
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
		<Main noAccess={noAccess} columns={1} layout='flex'>
			<Form
				method='post'
				onKeyDown={e => {
					if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
						e.preventDefault() // Prevent unintended form submission
					}
				}}
			>
				<h1 className='text-2xl font-semibold text-slate-700 mt-2 mb-4'>Create new collection</h1>
				<FormGroup>
					<InputGroup placeholder='collection name' leftIcon='git-repo' large name='name' />
				</FormGroup>
				<FormGroup label='Memos' labelInfo={Asterisk}>
					<TextArea onChange={e => handleMemoChange(e.target.value)} required placeholder={contentPlaceholder} name='content' className='w-[100%] min-h-[400px] text-sm' />
				</FormGroup>
				<FormGroup label='Tags'>
					<MyMultiSelect allowCreate icon='tag' menuItems={tagItems} name='tags' placeholder='add tags' />
				</FormGroup>
				<FormGroup>
					<Switch label='Share with study mates' onChange={e => handleSwitch(e.target.checked)} />
					<MyMultiSelect allowCreate={false} disabled={!checked} icon='user' menuItems={studyMateItems} name='studyMates' placeholder='add study mates' />
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
