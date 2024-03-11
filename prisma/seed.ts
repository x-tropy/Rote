import { PrismaClient } from "@prisma/client"

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

	await Promise.all(
		getCollections().map(collection => {
			return db.collection.create({
				data: {
					name: collection.name,
					memos: {
						create: collection.memos.map(memo => {
							return {
								title: memo.title,
								content: memo.content,
								tags: {
									connectOrCreate: memo.tags.map(tag => {
										return {
											where: {
												// ※ 对应到 Schema 定义中 name 必须 unique
												name: tag.name
											},
											create: {
												name: tag.name,
												aliase: tag.aliase
											}
										}
									})
								}
							}
						})
					}
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
		}
	]
}

function getCollections() {
	return [
		{
			name: "German1000",
			memos: [
				{
					title: "Wie",
					content: "What",
					tags: [
						{
							name: "german",
							aliase: "🇩🇪"
						}
					]
				},
				{
					title: "Woher",
					content: "Where",
					tags: [
						{
							name: "german",
							aliase: "🇩🇪"
						},
						{
							name: "high-frequency",
							aliase: "🔥"
						}
					]
				}
			]
		},
		{
			name: "English1000",
			memos: [
				{
					title: "What",
					content: "什么",
					tags: [
						{
							name: "english",
							aliase: "🇬🇧"
						},
						{
							name: "high-frequency",
							aliase: "🔥"
						}
					]
				},
				{
					title: "Where",
					content: "在哪里",
					tags: [
						{
							name: "english",
							aliase: "🇬🇧"
						}
					]
				}
			]
		}
	]
}
