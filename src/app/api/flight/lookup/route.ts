import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const flightIata = searchParams.get('flight_iata'); // e.g. "G37654"

    if (!flightIata) {
        return NextResponse.json({ error: 'Número de vuelo requerido (ej: G37654)' }, { status: 400 });
    }

    const apiKey = process.env.AVIATIONSTACK_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'API Key no configurada' }, { status: 500 });
    }

    try {
        // AviationStack expects 'flight_iata' param
        const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flightIata}&limit=1`;

        console.log(`Fetching flight data for: ${flightIata}`);
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`AviationStack API Error: ${res.statusText}`);
        }

        const data = await res.json();

        if (data.error) {
            console.error('AviationStack API Error Response:', data.error);
            return NextResponse.json({ error: 'Error en la API de vuelos' }, { status: 500 });
        }

        if (!data.data || data.data.length === 0) {
            return NextResponse.json({ error: 'Vuelo no encontrado o sin datos recientes' }, { status: 404 });
        }

        // Return the most relevant flight data
        const flight = data.data[0];

        const simplifiedFlight = {
            airline: flight.airline.name,
            flightNumber: flight.flight.iata,
            origin: flight.departure.airport,
            originIata: flight.departure.iata,
            destination: flight.arrival.airport,
            destinationIata: flight.arrival.iata,
            departureDate: flight.departure.scheduled ? flight.departure.scheduled.split('T')[0] : '',
            departureTime: flight.departure.scheduled ? flight.departure.scheduled.split('T')[1].substring(0, 5) : '',
            arrivalDate: flight.arrival.scheduled ? flight.arrival.scheduled.split('T')[0] : '',
            arrivalTime: flight.arrival.scheduled ? flight.arrival.scheduled.split('T')[1].substring(0, 5) : '',
            status: flight.flight_status, // scheduled, active, landed, cancelled
            terminal: flight.departure.terminal,
            gate: flight.departure.gate
        };

        return NextResponse.json(simplifiedFlight);

    } catch (error) {
        console.error('Error fetching flight:', error);
        return NextResponse.json({ error: 'Error interno al buscar vuelo' }, { status: 500 });
    }
}
