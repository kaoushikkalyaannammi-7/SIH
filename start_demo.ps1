Write-Host "Starting SIH 2026 PS 23 Demo..."

Write-Host "1. Starting ML Service (Port 8000)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ml-service; .\venv\Scripts\Activate.ps1; uvicorn main:app --host 0.0.0.0 --port 8000"

Write-Host "2. Starting Node Backend (Port 5000)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; node src/index.js"

Write-Host "Waiting 10 seconds for backend to start and initialize in-memory DB..."
Start-Sleep -Seconds 10

Write-Host "3. Seeding Database..."
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/offers/seed" -Method Post
    Write-Host "Database seeded successfully." -ForegroundColor Green
} catch {
    Write-Host "Failed to seed database, the backend might still be starting." -ForegroundColor Yellow
}

Write-Host "4. Starting React Frontend (Port 5173)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "All services started! You can view the app at http://localhost:5173" -ForegroundColor Cyan
