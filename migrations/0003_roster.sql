-- 2026-27 team rosters (loaded from PlayMetrics by the director; player data lives only in the database)
CREATE TABLE IF NOT EXISTS roster (
  id          TEXT PRIMARY KEY,
  team        TEXT NOT NULL,
  name        TEXT NOT NULL,
  num         TEXT NOT NULL DEFAULT '',
  birth_year  TEXT NOT NULL DEFAULT '',
  position    TEXT NOT NULL DEFAULT '',
  pos_key     TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS roster_team ON roster (team, name);
ALTER TABLE idps ADD COLUMN roster_id TEXT;
