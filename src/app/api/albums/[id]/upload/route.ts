import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import prisma from '@/lib/prisma';
import { supabaseServer } from '@/lib/supabase';

// Increase limit for this specific route
export const config = {
    api: {
        bodyParser: false,
    },
};

export const maxDuration = 60;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
        });

        if (!album) {
            return NextResponse.json({ error: 'Álbum no encontrado' }, { status: 404 });
        }

        if (album.userId !== decoded.id) {
            return NextResponse.json({ error: 'No tienes permiso' }, { status: 403 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const ext = file.name.split('.').pop();
        const filename = `${album.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseServer.storage
            .from('album-files')
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error('Supabase Upload Error:', uploadError);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        // Determine file type
        const type = file.type.startsWith('video/') ? 'video' : 'image';

        // Create database record
        const mediaFile = await prisma.mediaFile.create({
            data: {
                filename: uploadData.path,
                originalName: file.name,
                type,
                mimeType: file.type,
                albumId: album.id,
            },
        });

        return NextResponse.json({ file: mediaFile }, { status: 201 });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Error interno al subir archivo' }, { status: 500 });
    }
}
