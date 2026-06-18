$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Frontend = Join-Path $Root "frontend"

Set-Location $Frontend

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..."
    npm install
}

$env:VITE_API_BASE_URL = "http://localhost:8000/api"

Write-Host "Starting frontend at http://localhost:5173"
npm run dev
