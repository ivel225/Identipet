$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$DatabaseName = "identipet"
$DatabaseUser = "identipet"
$DatabasePassword = "identipet_dev_password"

Write-Host "Initializing IDentiPet local PostgreSQL database..."

$psql = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psql) {
    throw "psql was not found. Add PostgreSQL bin to PATH or run the SQL files manually with SQL Shell (psql)."
}

$env:PGPASSWORD = Read-Host "Enter your local PostgreSQL postgres/admin password"

psql -U postgres -h localhost -p 5432 -d postgres -c "DO `$`$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DatabaseUser') THEN CREATE ROLE $DatabaseUser LOGIN PASSWORD '$DatabasePassword'; END IF; END `$`$;"
psql -U postgres -h localhost -p 5432 -d postgres -c "ALTER ROLE $DatabaseUser WITH PASSWORD '$DatabasePassword';"
psql -U postgres -h localhost -p 5432 -d postgres -c "SELECT 'CREATE DATABASE $DatabaseName OWNER $DatabaseUser' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DatabaseName')\gexec"

$env:PGPASSWORD = $DatabasePassword
psql -U $DatabaseUser -h localhost -p 5432 -d $DatabaseName -f "$Root\database\init\001_types.sql"
psql -U $DatabaseUser -h localhost -p 5432 -d $DatabaseName -f "$Root\database\init\002_schema.sql"
psql -U $DatabaseUser -h localhost -p 5432 -d $DatabaseName -f "$Root\database\init\003_indexes.sql"

Write-Host "Local database is ready."
