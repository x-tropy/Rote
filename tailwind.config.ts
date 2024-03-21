import type { Config } from "tailwindcss"
import colors from "tailwindcss/colors"

export default {
	/* 📡 declares that: all files, under /app folder, with following extension
	may include tailwindcss */
	content: ["./app/**/*.{tsx,ts,js,jsx}"],
	safelist: [
		{
			pattern: /(from|via|to)-([a-zA-Z]+)-\d{3}/
		}
	],
	theme: {
		extend: {
			colors: {
				red: colors.red,
				orange: colors.orange,
				amber: colors.amber,
				yellow: colors.yellow,
				lime: colors.lime,
				green: colors.green,
				emerald: colors.emerald,
				teal: colors.teal,
				cyan: colors.cyan,
				sky: colors.sky,
				blue: colors.blue,
				indigo: colors.indigo,
				violet: colors.violet,
				purple: colors.purple,
				fuchsia: colors.fuchsia,
				pink: colors.pink,
				rose: colors.rose
			}
		}
	},
	plugins: []
} satisfies Config
