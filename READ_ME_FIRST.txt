BIRYANI BETRAYAL — BOT UPDATE

Upload these files to your GitHub repository, preserving folder paths.
REPLACE:
  app/page.tsx
  app/globals.css
  components/tutorial.tsx
  lib/game.mjs
  lib/game-service.mjs
ADD:
  lib/bots.mjs
  tests/bots.test.mjs (automated checks)

Keep all other existing files, including the night announcement files.
Do not replace your repository with only these patch files.
Commit message: Add host-controlled bot guests
Vercel will build the new commit automatically if Git integration is enabled.
No new environment variables, paid AI service, or database migration is required.

HOW TO PLAY
Create a room. In the lobby choose Bot guests, then Start the game.
For solo play select at least 3 bots; total humans + bots must be 4–12.
For friends to join a full room, lower the bot count first.
Only the host can change bots, and only in the lobby.
Bots stay for Play again; adjust their count before starting the next match.

Bots are labelled BOT. They take role actions, choose Ameen specialties,
coordinate gang attacks, discuss suspicions, reply when named, and vote.
They use their own filtered role information and investigation results.
Chats use rule-based phrases, not an LLM. They can bluff and make mistakes.
At least one human game tab must remain open to poll and advance bot turns.
Keep the normal 45-second night; bots act after roughly 4–10 seconds.

VALIDATION
30 automated tests pass, including full mixed-player matches at 4, 6, 7, 8,
and 12 guests, role privacy, private gang chat, seat limits, and authorization.
Production build and TypeScript checks pass.
