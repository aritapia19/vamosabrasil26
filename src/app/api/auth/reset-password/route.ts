import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Token y contraseña requeridos' }, { status: 400 });
        }

        // Buscar token válido
        const recoveryToken = await prisma.recoveryToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!recoveryToken) {
            return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 400 });
        }

        if (recoveryToken.expiresAt < new Date()) {
            await prisma.recoveryToken.delete({ where: { id: recoveryToken.id } }); // Limpiar expirado
            return NextResponse.json({ error: 'El token ha expirado. Solicita uno nuevo.' }, { status: 400 });
        }

        // Actualizar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: recoveryToken.userId },
            data: { password: hashedPassword },
        });

        // Eliminar token usado
        await prisma.recoveryToken.delete({
            where: { id: recoveryToken.id },
        });

        // Opcional: Eliminar otros tokens del mismo usuario por seguridad
        await prisma.recoveryToken.deleteMany({
            where: { userId: recoveryToken.userId },
        });

        return NextResponse.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error('Error en reset-password route:', error);
        return NextResponse.json({ error: 'Error al restablecer la contraseña' }, { status: 500 });
    }
}
