-- IDentiPet PostgreSQL initialization
-- Pillar 1: indexes for foreign keys and common lookup paths.

CREATE INDEX idx_owners_location
    ON owners (latitude, longitude);

CREATE INDEX idx_pets_owner_id
    ON pets (owner_id);

CREATE INDEX idx_nfc_tags_pet_id
    ON nfc_tags (pet_id);

CREATE INDEX idx_vaccination_records_pet_id
    ON vaccination_records (pet_id);

CREATE INDEX idx_vaccination_records_user_id
    ON vaccination_records (user_id);

CREATE INDEX idx_vaccination_records_next_due_date
    ON vaccination_records (next_due_date);

CREATE INDEX idx_scan_history_tag_id
    ON scan_history (tag_id);

CREATE INDEX idx_scan_history_user_id
    ON scan_history (user_id);

CREATE INDEX idx_scan_history_scan_datetime
    ON scan_history (scan_datetime DESC);
