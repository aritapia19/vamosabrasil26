import { NextResponse } from 'next/server';

const API_KEY = process.env.CURRENCY_API_KEY;

export async function GET() {
    try {
        // Si no hay API key, usamos una cotización base aproximada para la demo o intentamos sin key si la API lo permite
        // La mayoría requiere key. Usaremos una pública si es posible o fallback.
        const url = API_KEY
            ? `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/BRL/ARS`
            : `https://api.exchangerate.host/convert?from=BRL&to=ARS`; // Fallback o cotización mock

        const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache hourly
        const data = await res.json();

        if (data.result === 'success' || data.success) {
            const rate = data.conversion_rate || data.result;
            return NextResponse.json({ rate, date: new Date().toISOString() });
        }

        // Fallback manual si las APIs fallan
        return NextResponse.json({
            rate: 205.50, // Mock rate
            date: new Date().toISOString(),
            is_fallback: true
        });
    } catch (error) {
        console.error('Currency API error:', error);
        return NextResponse.json({
            rate: 205.50,
            date: new Date().toISOString(),
            is_fallback: true
        });
    }
}
