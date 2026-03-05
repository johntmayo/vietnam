-- ============================================================
--  Vietnam Field Journal — Supabase v2 setup
--  Run this once in: Supabase Dashboard → SQL Editor → New query
--  (The original user_places table must already exist from v1)
-- ============================================================

-- Stars table (one row per person-per-item)
CREATE TABLE IF NOT EXISTS stars (
  item_key   TEXT NOT NULL,
  user_name  TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (item_key, user_name)
);
ALTER TABLE stars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON stars FOR ALL USING (true) WITH CHECK (true);
ALTER PUBLICATION supabase_realtime ADD TABLE stars;

-- Item metadata — Maps URLs for hardcoded items
CREATE TABLE IF NOT EXISTS item_meta (
  item_key   TEXT PRIMARY KEY,
  maps_url   TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE item_meta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON item_meta FOR ALL USING (true) WITH CHECK (true);

-- Add maps_url to existing user_places table
ALTER TABLE user_places ADD COLUMN IF NOT EXISTS maps_url TEXT DEFAULT '';

-- Migrate old category values → new 'do' / 'eat' sections
UPDATE user_places SET category = 'eat' WHERE category IN ('food', 'bar', 'cafe');
UPDATE user_places SET category = 'do'  WHERE category IN ('shop', 'activity');

-- ============================================================
--  Hardcoded item key reference
--  Format: {city-slug}-{section}-{0-based-index}
--
--  HO CHI MINH CITY (ho-chi-minh)
--   do:
--    ho-chi-minh-do-0  = War Remnants Museum
--    ho-chi-minh-do-1  = Reunification Palace
--    ho-chi-minh-do-2  = Ben Thanh Market
--    ho-chi-minh-do-3  = Cu Chi Tunnels day trip
--    ho-chi-minh-do-4  = Notre-Dame Cathedral
--    ho-chi-minh-do-5  = Bui Vien Walking Street (night)
--    ho-chi-minh-do-6  = Mekong Delta day trip
--   eat:
--    ho-chi-minh-eat-0 = Pho Hoa Pasteur
--    ho-chi-minh-eat-1 = Banh Mi Huynh Hoa
--    ho-chi-minh-eat-2 = Cuc Gach Quan
--    ho-chi-minh-eat-3 = The Deck Saigon (sunset drinks)
--    ho-chi-minh-eat-4 = Noir. Dining in the Dark
--    ho-chi-minh-eat-5 = Bep Me In (home-style)
--
--  HOI AN (hoi-an)
--   do:
--    hoi-an-do-0  = Ancient Town (UNESCO)
--    hoi-an-do-1  = Japanese Covered Bridge
--    hoi-an-do-2  = Bicycle the rice paddies
--    hoi-an-do-3  = An Bang Beach
--    hoi-an-do-4  = Lantern-making class
--    hoi-an-do-5  = My Son Sanctuary day trip
--    hoi-an-do-6  = Cooking class (Morning Glory)
--   eat:
--    hoi-an-eat-0 = Banh Mi Phuong
--    hoi-an-eat-1 = Cao Lau Thanh
--    hoi-an-eat-2 = White Rose (White Rose dumplings)
--    hoi-an-eat-3 = Miss Ly Cafeteria
--    hoi-an-eat-4 = The Cargo Club (rooftop)
--    hoi-an-eat-5 = Nu Eatery
--
--  HANOI (hanoi)
--   do:
--    hanoi-do-0  = Hoan Kiem Lake & Ngoc Son Temple
--    hanoi-do-1  = Ho Chi Minh Mausoleum complex
--    hanoi-do-2  = Temple of Literature
--    hanoi-do-3  = Old Quarter walking tour
--    hanoi-do-4  = Vietnam Museum of Ethnology
--    hanoi-do-5  = Water Puppet Theatre
--    hanoi-do-6  = Train Street
--   eat:
--    hanoi-eat-0 = Pho Gia Truyen (Bat Dan)
--    hanoi-eat-1 = Bun Cha Huong Lien (Obama's spot)
--    hanoi-eat-2 = Cha Ca La Vong
--    hanoi-eat-3 = Chim Sao
--    hanoi-eat-4 = Cafe Giang (egg coffee)
--    hanoi-eat-5 = Bun Bo Nam Bo
--
--  HA LONG BAY (ha-long)
--   do:
--    ha-long-do-0  = Cruise (Sung Sot Cave)
--    ha-long-do-1  = Kayaking the karsts
--    ha-long-do-2  = Ti Top Island viewpoint
--   eat:
--    ha-long-eat-0 = Fresh seafood on the boat
--    ha-long-eat-1 = Cooking demo on cruise
-- ============================================================
