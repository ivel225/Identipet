$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Mobile = Join-Path $Root "mobile"

Set-Location $Mobile

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing mobile dependencies..."
    npm install
}

if (-not $env:EXPO_PUBLIC_API_BASE_URL) {
    $env:EXPO_PUBLIC_API_BASE_URL = "http://localhost:8000/api"
}

Write-Host "Starting Expo mobile app..."
Write-Host "Current API URL: $env:EXPO_PUBLIC_API_BASE_URL"
npm start
