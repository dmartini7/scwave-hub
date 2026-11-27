-- TAKA screenshots attached to an IDP as evidence (stored as compressed JPEG data URLs)
CREATE TABLE IF NOT EXISTS idp_files (
  id          TEXT PRIMARY KEY,
  idp_id      TEXT NOT NULL,
  kind        TEXT NOT NULL,          -- 'skill' | 'performance'
  data        TEXT NOT NULL,          -- data:image/jpeg;base64,...
  created_by  TEXT NOT NULL,
  created_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idp_files_idp ON idp_files (idp_id);
