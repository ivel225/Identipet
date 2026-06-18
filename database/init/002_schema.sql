-- IDentiPet PostgreSQL initialization
-- Pillar 1: normalized 3NF relational schema.

CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    role user_role NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE owners (
    owner_id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    contact_number VARCHAR(40) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    CONSTRAINT owners_latitude_range CHECK (
        latitude IS NULL OR (latitude >= -90 AND latitude <= 90)
    ),
    CONSTRAINT owners_longitude_range CHECK (
        longitude IS NULL OR (longitude >= -180 AND longitude <= 180)
    )
);

CREATE TABLE pets (
    pet_id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(80) NOT NULL,
    breed VARCHAR(100),
    gender VARCHAR(30),
    color VARCHAR(80),
    age INTEGER,
    birth_date DATE,
    CONSTRAINT pets_owner_fk FOREIGN KEY (owner_id)
        REFERENCES owners (owner_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT pets_age_non_negative CHECK (age IS NULL OR age >= 0)
);

CREATE TABLE nfc_tags (
    tag_id BIGSERIAL PRIMARY KEY,
    pet_id BIGINT NOT NULL,
    unique_code VARCHAR(255) NOT NULL UNIQUE,
    status nfc_tag_status NOT NULL DEFAULT 'Active',
    issue_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT nfc_tags_pet_fk FOREIGN KEY (pet_id)
        REFERENCES pets (pet_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE vaccination_records (
    record_id BIGSERIAL PRIMARY KEY,
    pet_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    vaccine_name VARCHAR(150) NOT NULL,
    date_administered DATE NOT NULL,
    next_due_date DATE,
    CONSTRAINT vaccination_records_pet_fk FOREIGN KEY (pet_id)
        REFERENCES pets (pet_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT vaccination_records_user_fk FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT vaccination_records_due_after_administered CHECK (
        next_due_date IS NULL OR next_due_date >= date_administered
    )
);

CREATE TABLE scan_history (
    scan_id BIGSERIAL PRIMARY KEY,
    tag_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    scan_datetime TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT scan_history_tag_fk FOREIGN KEY (tag_id)
        REFERENCES nfc_tags (tag_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT scan_history_user_fk FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
