#!/bin/bash

# Add all environment variables to Vercel production

echo "Adding DATABASE_URL..."
echo 'postgresql://postgres.epvrtjsakkzucqssxjow:ProyectoBrasil2026@aws-1-us-east-2.pooler.supabase.com:5432/postgres?pgbouncer=true' | vercel env add DATABASE_URL production

echo "Adding DIRECT_URL..."
echo 'postgresql://postgres:ProyectoBrasil2026@db.epvrtjsakkzucqssxjow.supabase.co:5432/postgres' | vercel env add DIRECT_URL production

echo "Adding NEXT_PUBLIC_APP_URL..."
echo 'https://vamosabrasil26.vercel.app' | vercel env add NEXT_PUBLIC_APP_URL production

echo "Adding EMAIL_HOST..."
echo 'smtp.gmail.com' | vercel env add EMAIL_HOST production

echo "Adding EMAIL_PORT..."
echo '587' | vercel env add EMAIL_PORT production

echo "Adding EMAIL_SECURE..."
echo 'false' | vercel env add EMAIL_SECURE production

echo "Adding EMAIL_USER..."
echo 'aritapia@gmail.com' | vercel env add EMAIL_USER production

echo "Adding EMAIL_PASS..."
echo 'exlh slcq njza qclm' | vercel env add EMAIL_PASS production

echo "Adding EMAIL_FROM..."
echo 'Vamos a Brasil <aritapia@gmail.com>' | vercel env add EMAIL_FROM production

echo "Adding NEXT_PUBLIC_SUPABASE_URL..."
echo 'https://epvrtjsakkzucqssxjow.supabase.co' | vercel env add NEXT_PUBLIC_SUPABASE_URL production

echo "Adding SUPABASE_SERVICE_KEY..."
echo 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwdnJ0anbWFra3p1Y3Fzc3hqb3ciLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzM2NDU5OTYxLCJleHAiOjIwNTIwMzU5NjF9.cnd-zP1fmp54LLZ8BxQVw_WNaof4LM' | vercel env add SUPABASE_SERVICE_KEY production

echo "Done! All variables added."
