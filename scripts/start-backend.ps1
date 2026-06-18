$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Backend = Join-Path $Root "backend"
$VenvPython = Join-Path $Backend ".venv\Scripts\python.exe"
$Activate = Join-Path $Backend ".venv\Scripts\Activate.ps1"

Set-Location $Backend

if (-not (Test-Path $VenvPython)) {
    Write-Host "Creating backend virtual environment..."
    python -m venv .venv
}

. $Activate

Write-Host "Installing backend dependencies..."
python -m pip install --upgrade pip
pip install -r requirements.txt

$env:DJANGO_DEBUG = "true"
$env:DJANGO_ALLOWED_HOSTS = "localhost,127.0.0.1"
$env:DJANGO_CORS_ALLOWED_ORIGINS = "http://localhost:5173"
$env:POSTGRES_DB = "identipet"
$env:POSTGRES_USER = "identipet"
$env:POSTGRES_PASSWORD = "identipet_dev_password"
$env:POSTGRES_HOST = "localhost"
$env:POSTGRES_PORT = "5432"
$env:USE_DATABASE_URL = "false"
$env:USE_POSTGRES = "false"
$env:DATABASE_URL = ""
$env:DATABASE_SSL_REQUIRE = "false"
$env:IDENTIPET_MANAGE_SCHEMA = "true"
$env:IDENTIPET_JWT_ISSUER = "identipet-api"
$env:IDENTIPET_JWT_EXPIRY_MINUTES = "120"

Write-Host "Preparing local SQLite database..."
python manage.py migrate --run-syncdb

Write-Host "Starting backend at http://localhost:8000/api"
python manage.py runserver 0.0.0.0:8000
