import type { Config } from "tailwindcss"

export default {
	/* 📡 declares that: all files, under /app folder, with following extension
	may include tailwindcss */
	content: ["./app/**/*.{tsx,ts,js,jsx}"],

	theme: {
		extend: {}
	},
	plugins: []
} satisfies Config
