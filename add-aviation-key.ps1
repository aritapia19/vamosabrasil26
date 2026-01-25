# PowerShell script to add AviationStack API Key to Vercel

Write-Host "Adding AVIATIONSTACK_API_KEY..." -ForegroundColor Green
"9d9ecaefce970af9e2d4abf65ebb7abf" | vercel env add AVIATIONSTACK_API_KEY production

Write-Host "`nDone! run: vercel --prod" -ForegroundColor Cyan
