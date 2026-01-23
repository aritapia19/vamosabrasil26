import { NextResponse } from 'next/server';

const API_KEY = process.env.WEATHER_API_KEY;

export async function GET() {
    try {
        if (!API_KEY) {
            return NextResponse.json(
                { error: 'API key no configurada' },
                { status: 500 }
            );
        }

        // Coordenadas de Búzios, Brasil
        const lat = -22.7467;
        const lon = -41.8817;

        const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&lang=es`;

        const res = await fetch(url, {
            next: { revalidate: 900 } // Cache por 15 minutos
        });

        if (!res.ok) {
            throw new Error('Error al obtener datos del clima');
        }

        const data = await res.json();

        return NextResponse.json({
            location: data.location.name,
            temperature: data.current.temp_c,
            feelsLike: data.current.feelslike_c,
            condition: data.current.condition.text,
            conditionIcon: data.current.condition.icon,
            humidity: data.current.humidity,
            windKph: data.current.wind_kph,
            lastUpdated: data.current.last_updated,
        });
    } catch (error) {
        console.error('Weather API error:', error);
        return NextResponse.json(
            {
                location: 'Búzios',
                temperature: 28,
                feelsLike: 30,
                condition: 'Parcialmente nublado',
                conditionIcon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
                humidity: 75,
                windKph: 15,
                lastUpdated: new Date().toISOString(),
                isFallback: true,
            },
            { status: 200 }
        );
    }
}
