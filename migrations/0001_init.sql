-- SC Wave coaches area: Individual Development Plans
CREATE TABLE IF NOT EXISTS idps (
  id          TEXT PRIMARY KEY,
  player      TEXT NOT NULL DEFAULT '',
  team        TEXT NOT NULL DEFAULT '',
  position    TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'draft',   -- draft | review | approved
  data        TEXT NOT NULL,                   -- full IDP as JSON
  created_by  TEXT NOT NULL,
  created_at  TEXT NOT NULL,
  updated_by  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idps_team ON idps (team, player);

-- Snapshots for recovery: taken on status changes and at most every 30 minutes of editing.
CREATE TABLE IF NOT EXISTS idp_versions (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  idp_id    TEXT NOT NULL,
  status    TEXT NOT NULL,
  data      TEXT NOT NULL,
  saved_by  TEXT NOT NULL,
  saved_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idp_versions_idp ON idp_versions (idp_id, saved_at);
