# IDentiPet Database Pillar

This folder contains the PostgreSQL initialization scripts for the first pillar
of IDentiPet: the normalized database schema.

## Script Order

Run the files in lexical order:

1. `init/001_types.sql`
2. `init/002_schema.sql`
3. `init/003_indexes.sql`
Optional local development data lives in `seeds/dev_seed.sql` and should be run
manually only when you want demo users.

## 3NF Notes

- `owners` stores owner identity, contact details, and household coordinates.
- `pets` references `owners` through `owner_id`; pet attributes depend only on
  the pet primary key.
- `nfc_tags` references `pets` and stores tag identity/status only.
- `vaccination_records` references both the vaccinated pet and the staff user who
  administered or recorded the vaccine.
- `scan_history` references the scanned NFC tag and scanning user.
- User role and NFC tag status are PostgreSQL enum types to keep repeated domain
  values controlled without duplicating descriptive attributes.

## Important Security Note

The schema uses the requested `users.password` column name, but application code
must store Django-compatible password hashes in this field. Do not store
plaintext passwords outside throwaway local development data.
