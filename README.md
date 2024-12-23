# Rote

## Database

### Initialize

`npx prisma init --datasource-provider sqlite`

### Seeding

1. Open the package.json of your project

2. Install the required dependencies by running:
   `npm i -D tsx`
3. Add the following example to it:

```
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

Seeding process automatically start with first migration.

## Features

## Features

### Generate Memos
Create rich, engaging memos effortlessly with Rote. Powered by LLMs, memos include text, images, and audio, helping you retain information effectively.

![card decks](https://fly.storage.tigris.dev/vite/Rote/generate-memos.png)

### Card Decks
Organize your learning with customizable card decks. Group similar topics together, adjust difficulty levels, and track your progress efficiently.

![card decks](https://fly.storage.tigris.dev/vite/Rote/card-decks.png)

### Discover
Explore curated collections of memos and decks shared by others. Uncover new learning paths tailored to your interests and goals.

### Achievement
Celebrate your learning journey with achievements. Unlock milestones and track your growth as you master new knowledge.  
