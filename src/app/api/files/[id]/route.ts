import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import prisma from '@/lib/prisma';
import { supabaseServer } from '@/lib/supabase';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        const file = await prisma.mediaFile.findUnique({
            where: { id },
            include: { album: true },
        });

        if (!file) {
            return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
        }

        if (file.album.userId !== decoded.id) {
            return NextResponse.json({ error: 'No tienes permiso' }, { status: 403 });
        }

        // Delete from Supabase Storage
        await supabaseServer.storage.from('album-files').remove([file.filename]);

        // Delete from database
        await prisma.mediaFile.delete({ where: { id } });

        return NextResponse.json({ message: 'Archivo eliminado' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting file:', error);
        return NextResponse.json({ error: 'Error al eliminar archivo' }, { status: 500 });
    }
}
