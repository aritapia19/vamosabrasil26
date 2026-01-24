import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import prisma from '@/lib/prisma';
import { supabaseServer } from '@/lib/supabase';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

        const album = await prisma.album.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, email: true } },
                files: { orderBy: { createdAt: 'desc' } },
            },
        });

        if (!album) {
            return NextResponse.json({ error: 'Álbum no encontrado' }, { status: 404 });
        }

        const isOwner = album.userId === decoded.id;
        if (!isOwner && !album.isPublic) {
            return NextResponse.json({ error: 'No tienes permiso' }, { status: 403 });
        }

        // Add public URLs to files
        const albumWithUrls = {
            ...album,
            files: album.files.map(file => ({
                ...file,
                publicUrl: supabaseServer.storage.from('album-files').getPublicUrl(file.filename).data.publicUrl,
            })),
        };

        return NextResponse.json({ album: albumWithUrls, isOwner }, { status: 200 });
    } catch (error) {
        console.error('Error fetching album:', error);
        return NextResponse.json({ error: 'Error al obtener álbum' }, { status: 500 });
    }
}

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

        const album = await prisma.album.findUnique({
            where: { id },
            include: { files: true },
        });

        if (!album) {
            return NextResponse.json({ error: 'Álbum no encontrado' }, { status: 404 });
        }

        if (album.userId !== decoded.id) {
            return NextResponse.json({ error: 'No tienes permiso' }, { status: 403 });
        }

        // Delete files from Supabase Storage
        const filePaths = album.files.map(f => f.filename);
        if (filePaths.length > 0) {
            await supabaseServer.storage.from('album-files').remove(filePaths);
        }

        // Delete from database (cascades to files)
        await prisma.album.delete({ where: { id } });

        return NextResponse.json({ message: 'Álbum eliminado' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting album:', error);
        return NextResponse.json({ error: 'Error al eliminar álbum' }, { status: 500 });
    }
}
