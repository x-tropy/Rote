// Borrowed & modified from https://github.com/jenseng/abuse-the-platform/blob/main/app/utils/singleton.ts

export const singleton = <Value>(name: string, valueFactory: () => Value): Value => {
	// 🧠 global is a reserved variable in node.js
	const g = global as any

	// check if the singleton is already created
	g.__singletons ??= {}

	// check if it has a name property
	g.__singletons[name] ??= valueFactory()

	return g.__singletons[name]
}
