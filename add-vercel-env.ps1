# PowerShell script to add all environment variables to Vercel

Write-Host "Adding DATABASE_URL..." -ForegroundColor Green
"postgresql://postgres.epvrtjsakkzucqssxjow:ProyectoBrasil2026@aws-1-us-east-2.pooler.supabase.com:5432/postgres?pgbouncer=true" | vercel env add DATABASE_URL production

Write-Host "Adding DIRECT_URL..." -ForegroundColor Green
"postgresql://postgres:ProyectoBrasil2026@db.epvrtjsakkzucqssxjow.supabase.co:5432/postgres" | vercel env add DIRECT_URL production

Write-Host "Adding NEXT_PUBLIC_APP_URL..." -ForegroundColor Green
"https://vamosabrasil26.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL production

Write-Host "Adding EMAIL_HOST..." -ForegroundColor Green
"smtp.gmail.com" | vercel env add EMAIL_HOST production

Write-Host "Adding EMAIL_PORT..." -ForegroundColor Green
"587" | vercel env add EMAIL_PORT production

Write-Host "Adding EMAIL_SECURE..." -ForegroundColor Green
"false" | vercel env add EMAIL_SECURE production

Write-Host "Adding EMAIL_USER..." -ForegroundColor Green
"aritapia@gmail.com" | vercel env add EMAIL_USER production

Write-Host "Adding EMAIL_PASS..." -ForegroundColor Green
"exlh slcq njza qclm" | vercel env add EMAIL_PASS production

Write-Host "Adding EMAIL_FROM..." -ForegroundColor Green
"Vamos a Brasil <aritapia@gmail.com>" | vercel env add EMAIL_FROM production

Write-Host "Adding NEXT_PUBLIC_SUPABASE_URL..." -ForegroundColor Green
"https://epvrtjsakkzucqssxjow.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production

Write-Host "Adding SUPABASE_SERVICE_KEY..." -ForegroundColor Green
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwdnJ0anbWFra3p1Y3Fzc3hqb3ciLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzM2NDU5OTYxLCJleHAiOjIwNTIwMzU5NjF9.cnd-zP1fmp54LLZ8BxQVw_WNaof4LM" | vercel env add SUPABASE_SERVICE_KEY production

Write-Host "`nDone! All variables added. Now run: vercel --prod" -ForegroundColor Cyan
