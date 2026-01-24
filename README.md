# Vamos a Brasil 2026 - BUZIOS 🇧🇷

Aplicación web completa para planificar y gestionar tu viaje a Búzios, Brasil. Incluye autenticación segura, contador regresivo en tiempo real, carrusel visual de destinos, conversor de moneda, clima y gestión de vuelos.

## 🚀 Tecnologías Utilizadas

- **Frontend/Backend**: Next.js 14+ (App Router, TypeScript)
- **Base de Datos**: Prisma ORM con PostgreSQL (Supabase)
- **Autenticación**: JWT (JSON Web Tokens) con Cookies HttpOnly
- **Email**: Nodemailer (para recuperación de contraseña)
- **Estilos**: Vanilla CSS (CSS Modules) - Diseño moderno y dinámico
- **Iconos**: Lucide React
- **Manejo de Fechas**: Date-fns
- **Imágenes**: Next.js Image Optimization

## ✨ Funcionalidades Principales

### 🔐 Sistema de Autenticación Completo
- **Registro de usuarios** con validación y hasheo de contraseñas (bcrypt)
- **Login seguro** con sesiones JWT en cookies HttpOnly
- **Recuperación de contraseña** funcional con envío de emails
- **Página de restablecimiento** con tokens de seguridad y expiración

### 🎨 Interfaz Visual Moderna
- **Header global** con logo "BUZIOS" (tipografía bold y blanca)
- **Carrusel de destinos** estilo premium con 8 slides:
  - GOL (Aerolínea)
  - Traslado (InBuzios)
  - Pousada Villegagnon
  - Playas de Búzios
  - Excursiones en Barco
  - Rua das Pedras (Vida Nocturna)
  - Arraial do Cabo
  - Rio de Janeiro
- **Contador regresivo** integrado en el header (modo compacto) con actualización en tiempo real
- **Diseño responsivo** optimizado para móviles y desktop

### 🛠️ Herramientas de Viaje
- **Conversor de moneda** BRL ↔ ARS con API en tiempo real
- **Widget de clima** para Búzios
- **Gestor de vuelos** con códigos PNR y detalles de reserva

## 🛠️ Configuración Local

### 1. Requisitos
- Node.js 18.x o superior
- Una cuenta en [Supabase](https://supabase.com)
- Credenciales SMTP o API Key para envío de emails (Gmail, Resend, SendGrid, etc.)

### 2. Instalación
```bash
git clone https://github.com/aritapia19/vamosabrasil26.git
cd vamosabrasil26
npm install
```

### 3. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de Datos (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.epvrtjsakkzucqssxjow.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.epvrtjsakkzucqssxjow.supabase.co:5432/postgres"

# Autenticación
JWT_SECRET="tu_secreto_seguro_aqui"

# Email (para recuperación de contraseña)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password_o_api_key
EMAIL_SECURE=false
EMAIL_FROM="Vamos a Brasil <noreply@vamosabrasil.com>"

# URL de la aplicación (para links en emails)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Nota**: Para Gmail, necesitas generar una [App Password](https://support.google.com/accounts/answer/185833). Para otros servicios como Resend o SendGrid, usa su API Key.

### 4. Base de Datos
Ejecuta las migraciones para crear las tablas:
```bash
npx prisma generate
npx prisma db push
```

### 5. Ejecución
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

## 🌐 Despliegue en Vercel

1. Conecta tu repositorio de GitHub en el dashboard de Vercel
2. Agrega todas las variables de entorno del archivo `.env`
3. Vercel detectará automáticamente Next.js y realizará el despliegue

**Variables de entorno críticas para producción:**
- `DATABASE_URL` y `DIRECT_URL`
- `JWT_SECRET`
- `EMAIL_*` (todas las relacionadas con email)
- `NEXT_PUBLIC_APP_URL` (debe ser tu dominio de producción)

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/auth/          # Endpoints de autenticación
│   │   ├── login/
│   │   ├── register/
│   │   ├── recovery/      # Solicitud de recuperación
│   │   └── reset-password/ # Cambio de contraseña
│   ├── login/             # Página de inicio de sesión
│   ├── register/          # Página de registro
│   ├── recovery/          # Página de recuperación
│   ├── reset-password/    # Página de restablecimiento
│   └── page.tsx           # Dashboard principal
├── components/
│   ├── Auth/              # Formularios de autenticación
│   ├── Carousel/          # Carrusel de destinos
│   ├── Countdown/         # Contador regresivo
│   ├── CurrencyConverter/ # Conversor de moneda
│   ├── FlightManager/     # Gestor de vuelos
│   ├── Header/            # Header global
│   └── WeatherWidget/     # Widget de clima
├── lib/
│   ├── email.ts           # Utilidad de envío de emails
│   ├── jwt.ts             # Manejo de tokens JWT
│   └── prisma.ts          # Cliente de Prisma
└── prisma/
    └── schema.prisma      # Esquema de base de datos
```

## 🗄️ Modelos de Base de Datos

### User
- Información de usuario (email, password hasheado, nombre)
- Relaciones con tokens de recuperación y reservas de vuelo

### RecoveryToken
- Tokens de recuperación de contraseña
- Expiración automática (1 hora)
- Vinculado a usuario específico

### FlightBooking
- Gestión de reservas de vuelo
- Códigos PNR, fechas, pasajeros, estado

## 📝 Decisiones Técnicas

- **Next.js App Router**: Arquitectura moderna con Server Components y API Routes integradas
- **Supabase (PostgreSQL)**: Base de datos relacional robusta con escalabilidad
- **JWT + HttpOnly Cookies**: Seguridad estándar para sesiones sin exposición en localStorage
- **Nodemailer**: Solución universal para envío de emails compatible con cualquier proveedor SMTP
- **Vanilla CSS**: Control total sobre el diseño, evitando dependencias pesadas como Tailwind
- **Prisma ORM**: Type-safety y migraciones automáticas para la base de datos
- **Carrusel Custom**: Implementación nativa con CSS transitions para mejor rendimiento

## 🎯 Flujos de Usuario

### Recuperación de Contraseña
1. Usuario ingresa email en `/recovery`
2. Sistema genera token único y lo guarda en DB
3. Email enviado con link de restablecimiento
4. Usuario hace clic en link (válido por 1 hora)
5. Ingresa nueva contraseña en `/reset-password?token=...`
6. Contraseña actualizada y token eliminado

### Experiencia Visual
1. Login con título "VAMOS A BRASIL"
2. Dashboard con Header sticky (logo BUZIOS + contador compacto)
3. Carrusel full-width con 8 destinos
4. Widgets de utilidades (moneda, clima, vuelos)

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt (salt rounds: 10)
- Tokens JWT firmados con secret seguro
- Cookies HttpOnly para prevenir XSS
- Tokens de recuperación con expiración
- Validación de inputs en frontend y backend
- Limpieza automática de tokens expirados

## 📧 Configuración de Email

### Gmail
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
EMAIL_SECURE=false
```

### Resend
```env
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USER=resend
EMAIL_PASS=tu_api_key
EMAIL_SECURE=false
```

### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=tu_sendgrid_api_key
EMAIL_SECURE=false
```

## 🐛 Troubleshooting

**Error: "Cannot find module '@prisma/client'"**
```bash
npx prisma generate
```

**Emails no se envían en desarrollo**
- Verifica las credenciales en `.env`
- Revisa la consola del servidor para logs de email
- En desarrollo, el sistema logueará el link de recuperación en consola si falla el envío

**Carrusel no muestra imágenes**
- Asegúrate de que las imágenes estén en `public/images/carousel/`
- Verifica que los nombres coincidan: `01_gol.jpg`, `02_traslado.jpg`, etc.

## 📄 Licencia

Este proyecto es de uso personal para el viaje a Brasil 2026.

---

**Hecho con ❤️ para la aventura a Búzios 🏖️**
