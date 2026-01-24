import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendRecoveryEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email es requerido' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Por seguridad, no decimos si el usuario no existe, pero respondemos OK.
            // Opcional: Decir que no existe si la UX lo prefiere.
            return NextResponse.json({ message: 'Si el correo existe, se han enviado las instrucciones.' });
        }

        // Generar token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // 1 hora

        // Guardar token
        await prisma.recoveryToken.create({
            data: {
                token,
                expiresAt,
                userId: user.id,
            },
        });

        // Enviar email
        await sendRecoveryEmail(email, token);

        return NextResponse.json({ message: 'Instrucciones enviadas exitosamente.' });
    } catch (error) {
        console.error('Error en recovery route:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
