# Biryani Betrayal — complete source code

Live game: https://biryani-betrayal.supergoose7.chatgpt.site
Source snapshot: 636eb963ad89d2ce5375bdd42ce36f941fc2faeb

This ZIP contains the latest published game: anonymous roles, private Elaichi Gang chat, collective night attacks, Ameen's choice, tutorial, 45-second nights, personalised win/loss screens, and rotating nighttime facts.

## What is included

- app/page.tsx — game interface and browser session management
- app/globals.css — responsive biryani theme and result-screen styles
- app/api/game/route.ts — multiplayer API, room persistence and concurrency checks
- app/tutorial/page.tsx and components/tutorial.tsx — tutorial
- components/game-result.tsx and components/night-facts.tsx — results and rotating facts
- lib/game.mjs — server-side rules, role assignment, night actions, voting and private views
- lib/roles.mjs and lib/outcome.mjs — role descriptions and personal win/loss logic
- db/ and drizzle/ — database schema and SQL migration
- tests/ — 19 passing rules and outcome tests at export time
- package.json, pnpm-lock.yaml, build/, scripts/ and other configuration — framework and build support
- DEVELOPMENT_NOTES.md — original starter's detailed development documentation

Dependencies, Git history, local caches, deployed build output, account credentials, and live room/database contents are not included. The .openai/hosting.json file retains the existing Site's non-secret project identifier and DB binding, so this is a faithful export of the current project.

## Technology

React + TypeScript, Vinext/Vite, Cloudflare Workers, Cloudflare D1 (SQLite), and Drizzle. The browser polls the shared server roughly every 1.8 seconds. Secret roles and private chat are filtered on the server.

## Run locally

Requirements: Node.js 22.13 or newer, and pnpm 11.25.0. Extract the ZIP and open a terminal inside Biryani_Betrayal.

1. Install dependencies: `pnpm install --frozen-lockfile`
2. Run the rules tests: `node --test tests/*.test.mjs`
3. Build: `pnpm run build`
4. Initialise the LOCAL database once:

   `pnpm exec wrangler d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_flashy_wasp.sql`

5. Start the built game locally: `pnpm start`
6. Open the local URL printed in the terminal. To simulate separate players on one computer, use separate browser profiles or isolated browser sessions; normal tabs share the same saved player identity.

For development with hot reload, use `pnpm run dev` after preparing the local database. See DEVELOPMENT_NOTES.md for local storage and platform-specific details. These setup steps describe the included project's intended workflow; this exported copy has not been installed from scratch on your university server.

## Can I upload this using FileZilla?

FileZilla transfers files; it does not run this backend. This is NOT a static HTML-only website. Uploading this source to a normal public_html folder will not make multiplayer work.

The current backend imports cloudflare:workers and expects a D1 binding named DB. A Node.js-capable server alone does not provide those APIs. To host the whole game outside its current Sites/Workers environment, the university must provide a compatible runtime, or the backend and database adapter must be ported to what it supports (for example, a Node.js service and another database). A PHP/MySQL-only host needs a backend rewrite.

If you only want a different address, connecting a custom domain to the existing deployment avoids a backend migration. Ask your university what runtime, database, public URL and hosting permissions your account includes before choosing a deployment method.

## Game configuration

- Players: 4–12
- Elaichi Gang: 1 for 4–6 players; 2 for 7–11; 3 for 12
- Ameen setup: 45 seconds; no choice defaults to Hungry Guest
- Ameen joining the gang replaces a random existing gang member; the gang count stays fixed
- Night: 45 seconds; one attack only if every living gang member agrees on the same target
- Discussion: 90 seconds; host can open voting early
- Voting: 60 seconds; a unique highest vote eliminates one guest; ties eliminate nobody
- Night facts/tips: every 8 seconds
- Roles stay hidden except to the player, gang partners, and earned private investigation results
- Any guest can return a completed match to the lobby; the host starts the next round

Keep server-side filtering when modifying the code. Never return the complete room state, player session secrets, private role assignments, or gang chat to every browser.
