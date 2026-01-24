# INSTRUCCIONES DE CONFIGURACIÓN

## 1. Base de Datos (REQUERIDO)
# Opción A: Supabase (Recomendado)
# 1. Crea cuenta en https://supabase.com
# 2. Crea un nuevo proyecto
# 3. Ve a Settings → Database
# 4. Copia el connection string y reemplaza abajo

# Opción B: PostgreSQL local
# Asegúrate de tener PostgreSQL instalado y crear una base de datos

## 2. Configuración de Email (REQUERIDO)
# Opción A: Gmail (Fácil para desarrollo)
# 1. Activa "Acceso de apps menos seguras" en tu cuenta de Google
# 2. O mejor: crea una "Contraseña de aplicación" en Google

# Opción B: SendGrid (Recomendado para producción)
# 1. Regístrate en https://sendgrid.com
# 2. Crea una API Key
# 3. Usa SMTP: smtp.sendgrid.net:587

# Opción C: Resend (Moderno y fácil)
# 1. Regístrate en https://resend.com
# 2. Obtén tu API key

## 3. JWT Secret (REQUERIDO)
# Genera una clave segura de al menos 32 caracteres
# Puedes usar: openssl rand -base64 32

## CONFIGURACIÓN ACTUAL: