import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json(
        { message: 'Logout exitoso' },
        { status: 200 }
    );

    // Delete the token cookie
    response.cookies.delete('token');

    return response;
}
