# Remix boilerplate code

## Database

### Initialize

`npx prisma init --datasource-provider sqlite`

### Seeding

1. Open the package.json of your project
2. Add the following example to it:

```
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

If you are using ESM (ECMAScript modules):

```
"prisma": {
  "seed": "ts-node --require tsconfig-paths/register prisma/seed.ts"
}
```

3. Install the required dependencies by running:
   npm i -D ts-node tsconfig-paths
