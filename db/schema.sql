-- Run once in the Neon SQL Editor, or use npm run db:setup locally.
CREATE TABLE IF NOT EXISTS biryani_rooms (
    code TEXT PRIMARY KEY,
    state TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 0 CHECK (version >= 0)
);
