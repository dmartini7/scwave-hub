-- Failed sign-in counter per connection (10 failures → 15-minute pause)
CREATE TABLE IF NOT EXISTS login_attempts (
  ip        TEXT PRIMARY KEY,
  fails     INTEGER NOT NULL,
  first_at  INTEGER NOT NULL
);
