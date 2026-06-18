-- Optional Supabase hardening when the tables live in the public schema.
-- IDentiPet clients should use the Django API, not Supabase's public Data API.

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfc_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccination_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE users FROM anon, authenticated;
REVOKE ALL ON TABLE owners FROM anon, authenticated;
REVOKE ALL ON TABLE pets FROM anon, authenticated;
REVOKE ALL ON TABLE nfc_tags FROM anon, authenticated;
REVOKE ALL ON TABLE vaccination_records FROM anon, authenticated;
REVOKE ALL ON TABLE scan_history FROM anon, authenticated;
