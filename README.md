# Vamos a Brasil 2026 - Web App

Aplicación web responsive para seguir el camino al Mundial 2026, con autenticación de usuarios, contador regresivo en tiempo real y conversor de moneda (BRL a ARS).

## 🚀 Tecnologías Utilizadas
- **Frontend/Backend**: Next.js 14+ (App Router, TypeScript)
- **Base de Datos**: Prisma ORM con PostgreSQL (Supabase)
- **Autenticación**: JWT (JSON Web Tokens) con Cookies HttpOnly
- **Estilos**: Vanilla CSS (CSS Modules) - Paleta Verde y Amarilla
- **Iconos**: Lucide React
- **Manejo de Fechas**: Date-fns

## 🛠️ Configuración Local

### 1. Requisitos
- Node.js 18.x o superior
- Una cuenta en [Supabase](https://supabase.com)

### 2. Instalación
```bash
git clone https://github.com/aritapia19/vamosabrasil26.git
cd vamosabrasil26
npm install
```

### 3. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.epvrtjsakkzucqssxjow.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.epvrtjsakkzucqssxjow.supabase.co:5432/postgres"
JWT_SECRET="tu_secreto_seguro"
```

### 4. Base de Datos
Ejecuta las migraciones iniciales para crear las tablas en Supabase:
```bash
npx prisma db push
```

### 5. Ejecución
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

## 🌐 Despliegue en Vercel
1. Conecta tu repositorio de GitHub en el dashboard de Vercel.
2. Agrega la variable de entorno `DATABASE_URL` y `JWT_SECRET`.
3. Vercel detectará automáticamente Next.js y realizará el despliegue.

## 📝 Decisiones Técnicas
- **Next.js**: Elegido por su capacidad de manejar tanto el frontend como el backend (API Routes) en un solo proyecto, facilitando el despliegue y la consistencia del código.
- **Supabase (PostgreSQL)**: Proporciona una base de datos relacional robusta ideal para manejar usuarios y escalabilidad futura.
- **JWT + Cookies**: Un enfoque de seguridad estándar para mantener sesiones de forma segura y evitar ataques CSRF básicos mediante el uso de cookies HttpOnly.
- **Vanilla CSS**: Se evitó Tailwind para demostrar control absoluto sobre el diseño, logrando una interfaz única y temática (verde/amarilla).

## ✨ Funcionalidades
1. **Auth Completo**: Registro con hasheo de contraseñas (bcrypt), login con sesiones seguras y flujo de recuperación simulado.
2. **Contador Dinámico**: Actualización en tiempo real (segundo a segundo) hasta el 8 de abril de 2026.
3. **Conversor Pro**: Consumo de API externa con manejo de errores, caché y actualización manual de cotización.
