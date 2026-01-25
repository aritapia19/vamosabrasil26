# PowerShell script to fix Supabase Key (removing newlines)

Write-Host "Updating SUPABASE_SERVICE_KEY (removing newlines)..." -ForegroundColor Yellow

# Remove existing key first to be safe
vercel env rm SUPABASE_SERVICE_KEY production -y

# Add it back properly without newlines
Write-Output -NoNewline "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwdnJ0anbWFra3p1Y3Fzc3hqb3ciLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzM2NDU5OTYxLCJleHAiOjIwNTIwMzU5NjF9.cnd-zP1fmp54LLZ8BxQVw_WNaof4LM" | vercel env add SUPABASE_SERVICE_KEY production

Write-Host "`nKey updated! Now run: vercel --prod" -ForegroundColor Cyan
