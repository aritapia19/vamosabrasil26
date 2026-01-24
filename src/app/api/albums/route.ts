import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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

        // Create upload directory
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'albums', album.id);
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Process files
        const mediaFiles = [];
        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Generate unique filename
            const ext = file.name.split('.').pop();
            const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);

            // Determine file type
            const type = file.type.startsWith('video/') ? 'video' : 'image';

            // Create database record
            const mediaFile = await prisma.mediaFile.create({
                data: {
                    filename,
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
        const view = searchParams.get('view'); // 'own' or 'public'

        let albums;
        if (view === 'public') {
            // Get all public albums from all users
            albums = await prisma.album.findMany({
                where: { isPublic: true },
                include: {
                    user: { select: { name: true, email: true } },
                    files: { take: 1 }, // Get first file as thumbnail
                    _count: { select: { files: true } },
                },
                orderBy: { createdAt: 'desc' },
            });
        } else {
            // Get user's own albums
            albums = await prisma.album.findMany({
                where: { userId: decoded.id as string },
                include: {
                    files: { take: 1 },
                    _count: { select: { files: true } },
                },
                orderBy: { createdAt: 'desc' },
            });
        }

        return NextResponse.json({ albums }, { status: 200 });
    } catch (error) {
        console.error('Error fetching albums:', error);
        return NextResponse.json({ error: 'Error al obtener álbumes' }, { status: 500 });
    }
}
