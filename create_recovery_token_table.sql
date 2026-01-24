-- Script para crear la tabla RecoveryToken en Supabase
-- Ejecutar esto en: Supabase Dashboard → SQL Editor → New Query

-- Crear la tabla RecoveryToken
CREATE TABLE IF NOT EXISTS "RecoveryToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecoveryToken_pkey" PRIMARY KEY ("id")
);

-- Crear índice único para el token
CREATE UNIQUE INDEX IF NOT EXISTS "RecoveryToken_token_key" ON "RecoveryToken"("token");

-- Agregar foreign key a User
ALTER TABLE "RecoveryToken" 
ADD CONSTRAINT "RecoveryToken_userId_fkey" 
FOREIGN KEY ("userId") 
REFERENCES "User"("id") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Verificar que se creó correctamente
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'RecoveryToken';
