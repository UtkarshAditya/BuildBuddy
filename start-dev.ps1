# BuildBuddy Development Startup Script

Write-Host "Starting BuildBuddy Development Servers..." -ForegroundColor Cyan
Write-Host ""

# Start Django Backend
Write-Host "[1/2] Starting Django Backend..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath' ; python manage.py runserver"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Next.js Frontend
Write-Host "[2/2] Starting Next.js Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot' ; npm run dev"

Write-Host ""
Write-Host "✓ Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "API Docs: http://127.0.0.1:8000/api/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
