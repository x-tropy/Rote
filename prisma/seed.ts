import { PrismaClient } from "@prisma/client"
import bcrypt, { hash } from "bcrypt"

const db = new PrismaClient()

async function seed() {
	await Promise.all(
		getTags().map(tag => {
			return db.tag.create({
				data: {
					name: tag.name,
					aliase: tag.aliase
				}
			})
		})
	)

	const adminUser = await db.user.create({
		data: getUser()
	})

	await Promise.all(
		getCollections().map(collection => {
			return db.collection.create({
				data: {
					name: collection.name,
					tags: {
						connectOrCreate: collection.tags.map(tag => {
							return {
								where: { name: tag.name },
								create: {
									name: tag.name,
									aliase: tag.aliase
								}
							}
						})
					},
					memos: {
						create: collection.memos.map(memo => {
							return {
								title: memo.title,
								cue: memo.cue,
								answer: memo.answer
							}
						})
					},
					userId: adminUser.id
				}
			})
		})
	)
}

seed()
	.catch(e => {
		throw e
	})
	.finally(async () => {
		await db.$disconnect()
	})

function getTags() {
	return [
		{
			name: "german",
			aliase: "🇩🇪"
		},
		{
			name: "english",
			aliase: "🇬🇧"
		},
		{
			name: "high-frequency",
			aliase: "🔥"
		},
		{
			name: "important",
			aliase: "⚠"
		}
	]
}

function getCollections() {
	return [
		{
			name: "German1000",
			tags: [
				{
					name: "german",
					aliase: "🇩🇪"
				},
				{
					name: "high-frequency"
					// aliase: "🔥"
				}
			],
			memos: [
				{
					title: "Wie",
					cue: "a common german word",
					answer: "What"
				},
				{
					title: "Woher",
					answer: "Where"
				}
			]
		},
		{
			name: "English1000",
			tags: [
				{
					name: "english",
					aliase: "🇬🇧"
				},
				{
					name: "high-frequency",
					aliase: "🔥"
				}
			],
			memos: [
				{
					title: "What",
					cue: "a often used word",
					answer: "什么"
				},
				{
					title: "Where",
					answer: "在哪里"
				}
			]
		}
	]
}

function getUser() {
	const name = "admin"
	const passwordHash = hashPassword("123456")
	console.log("\n>>>>>>>>\n", { passwordHash }, "\n<<<<<<<<\n")
	return {
		name,
		passwordHash
	}
}

function hashPassword(password: string) {
	const saltRounds = 10
	return bcrypt.hashSync(password, saltRounds)
}
