import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Usamos economia.awesomeapi.com.br - API pública confiable sin necesidad de API key
        const url = 'https://economia.awesomeapi.com.br/json/last/BRL-ARS';

        const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache hourly
        const data = await res.json();

        // La API devuelve un objeto con la estructura: { "BRLARS": { "bid": "275.2508", ... } }
        if (data.BRLARS && data.BRLARS.bid) {
            const rate = parseFloat(data.BRLARS.bid);
            return NextResponse.json({
                rate,
                date: data.BRLARS.create_date || new Date().toISOString()
            });
        }

        // Fallback manual si la API falla
        return NextResponse.json({
            rate: 275.00, // Mock rate actualizado
            date: new Date().toISOString(),
            is_fallback: true
        });
    } catch (error) {
        console.error('Currency API error:', error);
        return NextResponse.json({
            rate: 275.00,
            date: new Date().toISOString(),
            is_fallback: true
        });
    }
}
