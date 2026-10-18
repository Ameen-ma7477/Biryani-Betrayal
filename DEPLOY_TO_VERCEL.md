# Deploy Biryani Betrayal to Vercel

## 1. Replace the old code on GitHub

Extract the ZIP. Upload the CONTENTS inside `Biryani_Betrayal_Vercel`, so `app`, `components`, `lib`, `db`, `package.json`, `package-lock.json`, and this guide are at the repository's top level.

Use a clean repository tree. Do not leave the previous project's files alongside these. In particular remove:

- `pnpm-lock.yaml`, `pnpm-workspace.yaml`, and `.npmrc`
- `vite.config.ts`, `postcss.config.mjs`, `drizzle.config.ts`, and `cloudflare-env.d.ts`
- `.openai/`, `build/`, the old `scripts/`, old `db/`, `drizzle/`, and `examples/`
- `components/ui/`, `components/connector-error.tsx`, `hooks/`, and `vendor/`
- Old connector files in `lib/`, `app/chatgpt-auth.ts`, and old ESLint configuration
- Old `node_modules`, `dist`, and generated caches, if you previously uploaded them

Then copy in ALL files from this new version, including its new `scripts/`, `db/`, `.gitignore`, and `.env.example`. This is a replacement project, not a small patch to the old build setup.

With GitHub Desktop, clone your existing repository to your computer, remove the old contents except the `.git` directory, copy in the new contents, then commit and push. Use a message such as `Convert game to Next.js and Neon for Vercel`.

If deleting many old files through the browser is inconvenient, you can instead create a new clean GitHub repository called `Biryani-Betrayal-Vercel`, upload this version there, and import that repository into Vercel. This preserves your original source repository as a backup.

## 2. Create/connect a Neon database

You need a shared database for multiplayer. Choose either route:

**Vercel integration:** In Vercel, import your GitHub project, then use Storage / Marketplace to add Neon and connect it to the project. If you need to create the Vercel project first, its first build can succeed without a database; creating rooms will show a setup message until the database is connected.

**Direct Neon account:** Create a project at https://neon.com, then copy its PostgreSQL connection string from the connection panel. In Vercel project Settings → Environment Variables, add it under `DATABASE_URL`.

The connection string resembles:

`postgresql://USER:PASSWORD@YOUR-NEON-HOST/neondb?sslmode=require`

Use your REAL connection string, not this placeholder. Never put it in a GitHub file, chat message, or a `NEXT_PUBLIC_` environment variable. If the integration creates a prefixed variable, make sure a variable named exactly `DATABASE_URL` is available to this project.

Enable it for Production. For Preview/Development, ideally use a separate Neon database/branch so test games do not share production data. Ensure the schema is set up in each database you use.

## 3. Create the database table once

Open the Neon SQL Editor for the database connected to Vercel. Paste the contents of `db/schema.sql` and run it:

```sql
CREATE TABLE IF NOT EXISTS biryani_rooms (
    code TEXT PRIMARY KEY,
    state TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 0 CHECK (version >= 0)
);
```

It is safe to rerun this table-creation statement. No live player data is included in the download.

Alternatively, on your own computer, set DATABASE_URL in `.env.local` and run `npm run db:setup` after installing dependencies.

## 4. Import and deploy

1. Open https://vercel.com/new and sign in with GitHub.
2. Import the repository containing this new version.
3. Framework Preset: **Next.js**.
4. Root Directory: the folder containing `package.json`. Leave it at the repository root if you uploaded the contents correctly.
5. Node.js version: **22.x**.
6. Use the normal project commands: install `npm ci`, build `npm run build`, output directory **default**. Do not set `dist` as the output directory.
7. Ensure `DATABASE_URL` is configured, and deploy/redeploy after adding or changing environment variables.
8. Open the production `.vercel.app` URL.

## 5. Test multiplayer

1. Open the production URL in one browser, create a room, and copy its invite link.
2. Ask friends to join from their own devices or use isolated browser profiles. Normal tabs in the same browser share one saved player identity.
3. Start with at least four players. Each player should see their own role; gang partners see each other only after setup.
4. Check chat, night actions, voting, and a result screen.
5. Share the Vercel production URL, not localhost or a protected preview link. If friends see a Vercel sign-in wall, check the deployment's protection settings.

## Troubleshooting

**Build still mentions Vite, Vinext, Cloudflare, or pnpm:** the old files/configuration were not fully replaced, the wrong repository/branch was imported, or Vercel still has old command overrides.

**Database not configured:** add `DATABASE_URL` to Vercel's Production environment and redeploy.

**Database could not be reached:** check the connection string, database availability, and that `db/schema.sql` was run in the exact connected database/branch. The app intentionally hides raw database errors from visitors.

**Only one player appears across several tabs:** use separate browser profiles/incognito sessions or separate devices.

**Old room code does not work:** the Vercel version uses a new database. Create a new room at the new URL.

## Validation included with this package

The rules tests cover role privacy, gang counts, shared attacks, Ameen, voting, and personalised outcomes. Database integration tests exercise actual PostgreSQL SQL through a local in-process PGlite test database, including concurrent updates. Production build verification is reported alongside the download. No access to your personal Vercel/Neon accounts is required to prepare this code; your actual hosted connection must be checked after you set up the database.

## Official references

- https://vercel.com/docs/frameworks/full-stack/nextjs
- https://vercel.com/marketplace/neon/neon
- https://neon.com/docs/serverless/serverless-driver
