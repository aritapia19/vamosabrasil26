import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import prisma from '@/lib/prisma';
import { supabaseServer } from '@/lib/supabase';

// Increase body size limit for file uploads
export const config = {
    api: {
        bodyParser: false,
    },
};

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        const formData = await req.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string | null;
        const isPublic = formData.get('isPublic') === 'true';
        const files = formData.getAll('files') as File[];

        if (!name || files.length === 0) {
            return NextResponse.json({ error: 'Nombre y archivos son requeridos' }, { status: 400 });
        }

        // Create album
        const album = await prisma.album.create({
            data: {
                name,
                description,
                isPublic,
                userId: decoded.id as string,
            },
        });

        // Upload files to Supabase Storage
        const mediaFiles = [];
        for (const file of files) {
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
                console.error('Upload error:', uploadError);
                continue;
            }

            // Determine file type
            const type = file.type.startsWith('video/') ? 'video' : 'image';

            // Create database record
            const mediaFile = await prisma.mediaFile.create({
                data: {
                    filename: uploadData.path, // Store Supabase path
                    originalName: file.name,
                    type,
                    mimeType: file.type,
                    albumId: album.id,
                },
            });

            mediaFiles.push(mediaFile);
        }

        return NextResponse.json({ album, files: mediaFiles }, { status: 201 });
    } catch (error) {
        console.error('Error creating album:', error);
        return NextResponse.json({ error: 'Error al crear álbum' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const view = searchParams.get('view');

        let albums;
        if (view === 'public') {
            albums = await prisma.album.findMany({
                where: { isPublic: true },
                include: {
                    user: { select: { name: true, email: true } },
                    files: { take: 1 },
                    _count: { select: { files: true } },
                },
                orderBy: { createdAt: 'desc' },
            });
        } else {
            albums = await prisma.album.findMany({
                where: { userId: decoded.id as string },
                include: {
                    files: { take: 1 },
                    _count: { select: { files: true } },
                },
                orderBy: { createdAt: 'desc' },
            });
        }

        // Add public URLs to files
        const albumsWithUrls = albums.map(album => ({
            ...album,
            files: album.files.map(file => ({
                ...file,
                publicUrl: supabaseServer.storage.from('album-files').getPublicUrl(file.filename).data.publicUrl,
            })),
        }));

        return NextResponse.json({ albums: albumsWithUrls }, { status: 200 });
    } catch (error) {
        console.error('Error fetching albums:', error);
        return NextResponse.json({ error: 'Error al obtener álbumes' }, { status: 500 });
    }
}
