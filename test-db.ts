import prisma from '@/lib/prisma';

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos exitosa');
    
    // Probar creación de usuario de prueba
    const testEmail = `test_${Date.now()}@example.com`;
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        name: 'Usuario de Prueba'
      }
    });
    
    console.log('✅ Usuario creado exitosamente:', user.email);
    
    // Limpiar usuario de prueba
    await prisma.user.delete({
      where: { id: user.id }
    });
    
    console.log('✅ Usuario de prueba eliminado');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();