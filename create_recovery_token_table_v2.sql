-- Script para crear la tabla RecoveryToken en Supabase
-- VERSIÓN MEJORADA: Maneja constraints duplicados
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query

-- Eliminar la constraint si existe (para evitar errores)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'RecoveryToken_userId_fkey'
    ) THEN
        ALTER TABLE "RecoveryToken" DROP CONSTRAINT "RecoveryToken_userId_fkey";
    END IF;
END $$;

-- Crear la tabla si no existe
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
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'RecoveryToken'
ORDER BY ordinal_position;
