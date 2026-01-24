import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Config {
  databaseUrl: string;
  directUrl: string;
  jwtSecret: string;
  emailHost: string;
  emailPort: string;
  emailSecure: string;
  emailUser: string;
  emailPass: string;
  emailFrom: string;
  appUrl: string;
}

function generateSecureKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let key = '';
  for (let i = 0; i < 64; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

export function setupEnvironment(config: Partial<Config>) {
  const envPath = join(process.cwd(), '.env');
  
  const defaultConfig: Config = {
    databaseUrl: config.databaseUrl || 'postgresql://user:password@localhost:5432/vamosabrasil',
    directUrl: config.directUrl || config.databaseUrl || 'postgresql://user:password@localhost:5432/vamosabrasil',
    jwtSecret: config.jwtSecret || generateSecureKey(),
    emailHost: config.emailHost || 'smtp.gmail.com',
    emailPort: config.emailPort || '587',
    emailSecure: config.emailSecure || 'false',
    emailUser: config.emailUser || 'tu_email@gmail.com',
    emailPass: config.emailPass || 'tu_contraseña',
    emailFrom: config.emailFrom || '"Vamos a Brasil" <noreply@vamosabrasil.com>',
    appUrl: config.appUrl || 'http://localhost:3000'
  };

  const envContent = `# Database Configuration
DATABASE_URL="${defaultConfig.databaseUrl}"
DIRECT_URL="${defaultConfig.directUrl}"

# JWT Configuration
JWT_SECRET="${defaultConfig.jwtSecret}"

# Email Configuration
EMAIL_HOST="${defaultConfig.emailHost}"
EMAIL_PORT="${defaultConfig.emailPort}"
EMAIL_SECURE="${defaultConfig.emailSecure}"
EMAIL_USER="${defaultConfig.emailUser}"
EMAIL_PASS="${defaultConfig.emailPass}"
EMAIL_FROM="${defaultConfig.emailFrom}"

# App Configuration
NEXT_PUBLIC_APP_URL="${defaultConfig.appUrl}"

# API Keys (Optional)
CURRENCY_API_KEY=""
WEATHER_API_KEY=""
`;

  writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env creado exitosamente');
  console.log('\n📋 Resumen de configuración:');
  console.log(`- Base de datos: ${defaultConfig.databaseUrl.includes('localhost') ? 'Local' : 'Remota'}`);
  console.log(`- Email: ${defaultConfig.emailHost}`);
  console.log(`- App URL: ${defaultConfig.appUrl}`);
  console.log(`- JWT Secret: ${defaultConfig.jwtSecret.substring(0, 20)}...`);
}

// Si se ejecuta directamente
if (require.main === module) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('🚀 Configurador de Vamos a Brasil 2026\n');
  console.log('Por favor, ingresa la siguiente información:\n');

  rl.question('URL de base de datos PostgreSQL: ', (databaseUrl) => {
    rl.question('URL de base de datos directa (opcional, presiona Enter para usar la misma): ', (directUrl) => {
      rl.question('Email para envío de correos: ', (emailUser) => {
        rl.question('Contraseña del email (o API key): ', (emailPass) => {
          rl.question('Servidor SMTP (presiona Enter para Gmail): ', (emailHost) => {
            rl.question('URL de la app (presiona Enter para http://localhost:3000): ', (appUrl) => {
              
              setupEnvironment({
                databaseUrl: databaseUrl || undefined,
                directUrl: directUrl || undefined,
                emailUser: emailUser || undefined,
                emailPass: emailPass || undefined,
                emailHost: emailHost || undefined,
                appUrl: appUrl || undefined
              });

              rl.close();
              
              console.log('\n🎉 Configuración completada!');
              console.log('\nPróximos pasos:');
              console.log('1. Revisa el archivo .env creado');
              console.log('2. Ejecuta: npm run dev');
              console.log('3. Visita: http://localhost:3000');
              console.log('4. Prueba el registro y login');
              
            });
          });
        });
      });
    });
  });
}