-- Optional development seed data.
-- Password values are placeholders for local development only. The backend will
-- store Django-compatible password hashes, not plaintext passwords.

INSERT INTO users (name, role, email, password)
VALUES
    ('System Administrator', 'Administrator', 'admin@identipet.local', 'change-me'),
    ('Veterinary Staff Demo', 'Veterinary Staff', 'vet@identipet.local', 'change-me'),
    ('Field Personnel Demo', 'Field Personnel', 'field@identipet.local', 'change-me')
ON CONFLICT (email) DO NOTHING;
