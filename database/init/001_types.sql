-- IDentiPet PostgreSQL initialization
-- Pillar 1: shared database types.

CREATE TYPE user_role AS ENUM (
    'Administrator',
    'Veterinary Staff',
    'Field Personnel'
);

CREATE TYPE nfc_tag_status AS ENUM (
    'Active',
    'Inactive',
    'Lost',
    'Retired'
);
