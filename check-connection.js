const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log('🔍 Iniciando diagnóstico de conexión...');

    // 1. Leer .env manualmente
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
        console.error('❌ No se encontró el archivo .env');
        return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const dbUrlMatch = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);

    if (!dbUrlMatch) {
        console.error('❌ No se encontró DATABASE_URL en .env');
        return;
    }

    const databaseUrl = dbUrlMatch[1];
    console.log(`📋 Connection String leído: ${databaseUrl.replace(/:[^:@]+@/, ':***@')}`);

    // 2. Probar conexión
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: databaseUrl,
            },
        },
        log: ['info', 'warn', 'error'],
    });

    try {
        console.log('⏳ Intentando conectar con Prisma...');
        const result = await prisma.$queryRaw`SELECT 1 as result`;
        console.log('✅ ¡CONEXIÓN EXITOSA!', result);

        const userCount = await prisma.user.count();
        console.log(`📊 Número de usuarios: ${userCount}`);

    } catch (error) {
        console.error('❌ ERROR DE CONEXIÓN:');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
