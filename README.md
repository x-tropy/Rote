# Remix boilerplate code

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
