const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
    log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
    try {
        console.log('Testing connection with DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'));

        const users = await prisma.user.findMany();
        console.log('✅ Connection successful!');
        console.log(`Found ${users.length} users in database`);

        if (users.length > 0) {
            console.log('First user:', users[0].email);
        }

    } catch (error) {
        console.error('❌ Connection failed:');
        console.error(error.message);
        console.error('\nFull error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
