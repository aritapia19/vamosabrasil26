const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log('🔍 TEST DE CONEXIÓN SIMPLIFICADO');

    // Leer env
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const dbUrlMatch = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
    const dbUrl = dbUrlMatch[1];

    // Quitar pgbouncer=true para probar
    const dbUrlClean = dbUrl.replace('?pgbouncer=true', '');
    console.log(`📡 Intentando conectar (SIN pgbouncer=true) a: ${dbUrlClean.replace(/:[^:@]+@/, ':***@')}`);

    const prisma = new PrismaClient({
        datasources: {
            db: { url: dbUrlClean },
        },
        // Habilitar logs detallados
        log: ['info', 'warn', 'error', 'query'],
    });

    try {
        console.log('⏳ Conectando...');
        await prisma.$connect();
        console.log('✅ $connect() EXITOSO - Conexión establecida');

        console.log('⏳ Probando query simple (count)...');
        const count = await prisma.user.count();
        console.log(`✅ Query exitosa. Usuarios: ${count}`);

    } catch (error) {
        console.error('❌ ERROR GRAVE:');
        console.error(JSON.stringify(error, null, 2));
        console.error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
