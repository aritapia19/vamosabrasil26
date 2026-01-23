import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token.value) as any;
        if (!decoded) {
            return NextResponse.json(
                { error: 'Token inválido' },
                { status: 401 }
            );
        }

        const {
            pnrCode,
            flightNumber,
            origin,
            destination,
            departureDate,
            departureTime,
            returnDate,
            returnTime,
            passengers,
        } = await req.json();

        if (!pnrCode || !origin || !destination || !departureDate) {
            return NextResponse.json(
                { error: 'Datos incompletos' },
                { status: 400 }
            );
        }

        // Verificar si ya existe una reserva con ese PNR
        const existing = await prisma.flightBooking.findUnique({
            where: { pnrCode },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Ya existe una reserva con este código PNR' },
                { status: 400 }
            );
        }

        const booking = await prisma.flightBooking.create({
            data: {
                userId: decoded.id,
                pnrCode: pnrCode.toUpperCase(),
                flightNumber,
                origin,
                destination,
                departureDate: new Date(departureDate),
                departureTime,
                returnDate: returnDate ? new Date(returnDate) : null,
                returnTime,
                passengers: parseInt(passengers) || 1,
            },
        });

        return NextResponse.json(
            { message: 'Reserva guardada exitosamente', booking },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json(
            { error: 'Error al guardar la reserva' },
            { status: 500 }
        );
    }
}

// GET para obtener todas las reservas del usuario
export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token.value) as any;
        if (!decoded) {
            return NextResponse.json(
                { error: 'Token inválido' },
                { status: 401 }
            );
        }

        const bookings = await prisma.flightBooking.findMany({
            where: { userId: decoded.id },
            orderBy: { departureDate: 'asc' },
        });

        return NextResponse.json({ bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json(
            { error: 'Error al obtener reservas' },
            { status: 500 }
        );
    }
}
