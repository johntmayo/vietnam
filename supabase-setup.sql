-- ============================================================
--  Vietnam Field Journal — Supabase setup
--  Run this once in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

CREATE TABLE user_places (
  id         UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  city       TEXT         NOT NULL,
  name       TEXT         NOT NULL,
  category   TEXT         NOT NULL DEFAULT 'food',   -- food | bar | cafe | shop | activity
  notes      TEXT         DEFAULT '',
  status     TEXT         DEFAULT 'want',             -- want | been | loved
  added_by   TEXT         DEFAULT '',
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- Row-level security (required to enable realtime)
ALTER TABLE user_places ENABLE ROW LEVEL SECURITY;

-- Allow full public access — the passphrase in the UI is the guard
CREATE POLICY "public_access" ON user_places
  FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime broadcasts for this table
ALTER PUBLICATION supabase_realtime ADD TABLE user_places;
