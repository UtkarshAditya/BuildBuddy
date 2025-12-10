# Stop all Django server jobs

Write-Host "Stopping Django servers..." -ForegroundColor Yellow

# Stop background jobs
Get-Job | Where-Object { $_.Command -like "*manage.py runserver*" } | Stop-Job
Get-Job | Where-Object { $_.Command -like "*manage.py runserver*" } | Remove-Job

# Find and stop Django processes on port 8000
$processes = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess -Unique

if ($processes) {
    foreach ($pid in $processes) {
        try {
            $process = Get-Process -Id $pid -ErrorAction Stop
            Write-Host "Stopping Django server (PID: $pid)" -ForegroundColor Yellow
            Stop-Process -Id $pid -Force
            Write-Host "✓ Stopped" -ForegroundColor Green
        } catch {
            Write-Host "Process $pid already stopped" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "No Django servers running on port 8000" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Cyan
