# Biryani Betrayal — Next.js + Vercel edition

A multiplayer social-deduction game for 4–12 people. This is the standard Next.js conversion of the existing game, using Neon PostgreSQL instead of Cloudflare Workers/D1.

## Start here

1. Extract this ZIP.
2. Replace the contents of your existing GitHub repository with the contents INSIDE the `Biryani_Betrayal_Vercel` folder. `package.json` and `app/` must be directly at the repository root.
3. Follow **DEPLOY_TO_VERCEL.md** to connect a database and deploy.

Do not just add the ZIP file to GitHub. Do not leave the old pnpm lockfile, Vite configuration, Cloudflare files, or old build scripts in the repository. The deployment guide lists the exact old files to remove.

## Requirements and local use

- Node.js 22.13 or newer (select Node.js 22.x on Vercel)
- npm (this project includes package-lock.json)
- A Neon PostgreSQL database connection string

```sh
npm ci
```

Copy `.env.example` to `.env.local`, then replace its placeholder with your Neon database connection string. Keep this secret and never upload `.env.local` to GitHub.

```sh
npm run db:setup
npm run dev
```

Open http://localhost:3000. Each player needs their own browser profile/session or device. For local tests use `npm test`; for production checks use `npm run build` then `npm start`.

## What changed

- Standard `next dev`, `next build`, and `next start` scripts.
- The multiplayer API runs as a Node.js route on Vercel.
- Shared room records are stored in PostgreSQL via the Neon HTTP driver.
- Version-checked updates preserve simultaneous joins, votes, messages, and night actions.
- The interface, role privacy, gang chat, gang limits, Ameen, tutorial, results, and nighttime facts are preserved.
- Database connection failures return a safe message without exposing credentials.

## Storage and sessions

The server stores secret roles and session identities in the private database. Only filtered player views are sent to browsers. Do not expose the database publicly or prefix the connection string with `NEXT_PUBLIC_`.

Your existing ChatGPT-hosted game is unchanged. This deployment uses its own new database; old rooms and saved browser identities are not transferred to the new domain. Everyone should create/join a new room on the new URL.

The database must remain available for multiplayer. Vercel and Neon each have account limits; review the limits shown in your dashboards. This polling-based game sends requests roughly every 1.8 seconds per connected player.

## Project map

- `app/` — Next.js pages and the multiplayer API
- `components/` — tutorial, result screen, and nighttime facts
- `lib/game.mjs` — rules and private player views
- `lib/game-service.mjs` — room actions and concurrency retries
- `lib/room-store.mjs` — parameterized PostgreSQL queries
- `lib/database.ts` — server-side Neon connection
- `db/schema.sql` — one-time database setup
- `scripts/setup-db.mjs` — optional local database setup helper
- `tests/` — rules, outcome, and database integration tests

No account credentials, live database contents, node_modules, or generated build output are included.
