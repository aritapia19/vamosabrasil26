'use client';

import { useState, useEffect } from 'react';
import { Plane, Calendar, Users, Plus, X, Search, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import styles from './FlightManager.module.css';

interface FlightBooking {
    id: string;
    pnrCode: string;
    airline: string;
    flightNumber?: string;
    origin: string;
    destination: string;
    departureDate: string;
    departureTime?: string;
    returnDate?: string;
    returnTime?: string;
    passengers: number;
    status: string;
}

export default function FlightManager() {
    const [bookings, setBookings] = useState<FlightBooking[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [formData, setFormData] = useState({
        pnrCode: '',
        flightNumber: '',
        origin: '',
        destination: '',
        departureDate: '',
        departureTime: '',
        returnDate: '',
        returnTime: '',
        passengers: '1',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const searchFlight = async () => {
        if (!formData.flightNumber) return;

        setSearching(true);
        setError('');

        try {
            // Remove spaces for API (e.g. G3 1234 -> G31234)
            const cleanFlightNum = formData.flightNumber.replace(/\s/g, '');
            const res = await fetch(`/api/flight/lookup?flight_iata=${cleanFlightNum}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Vuelo no encontrado');
            }

            // Auto-fill form
            setFormData(prev => ({
                ...prev,
                origin: `${data.origin} (${data.originIata})`,
                destination: `${data.destination} (${data.destinationIata})`,
                departureDate: data.departureDate,
                departureTime: data.departureTime,
                // If it's a return flight logic is complex, for now we just fill departures
            }));

            setSuccess('¡Datos del vuelo encontrados!');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error al buscar vuelo. Intenta ingresarlo manualmente.');
        } finally {
            setSearching(false);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/flight/booking');
            const data = await res.json();
            if (res.ok) {
                setBookings(data.bookings || []);
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/flight/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error al guardar la reserva');
            }

            setSuccess('¡Reserva guardada exitosamente!');
            setFormData({
                pnrCode: '',
                flightNumber: '',
                origin: '',
                destination: '',
                departureDate: '',
                departureTime: '',
                returnDate: '',
                returnTime: '',
                passengers: '1',
            });
            setShowForm(false);
            fetchBookings();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <Plane className={styles.icon} />
                    <div>
                        <h3 className={styles.title}>Mi viaje en avión</h3>
                        <p className={styles.subtitle}>Gestiona tus reservas</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={styles.addBtn}
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    <span>{showForm ? 'Cancelar' : 'Agregar'}</span>
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Código PNR *</label>
                            <input
                                type="text"
                                value={formData.pnrCode}
                                onChange={(e) => setFormData({ ...formData, pnrCode: e.target.value.toUpperCase() })}
                                placeholder="LEECLQ"
                                maxLength={6}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Número de Vuelo (ej: G3 7654)</label>
                            <div className={styles.flightSearchWrapper}>
                                <input
                                    type="text"
                                    value={formData.flightNumber}
                                    onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value.toUpperCase() })}
                                    placeholder="G37654"
                                />
                                <button
                                    type="button"
                                    className={styles.searchBtn}
                                    onClick={searchFlight}
                                    disabled={searching || !formData.flightNumber}
                                >
                                    {searching ? <Loader2 className={styles.spin} size={16} /> : <Search size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Origen *</label>
                            <input
                                type="text"
                                value={formData.origin}
                                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                placeholder="Buenos Aires (EZE)"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Destino *</label>
                            <input
                                type="text"
                                value={formData.destination}
                                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                placeholder="Río de Janeiro (GIG)"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Fecha de Salida *</label>
                            <input
                                type="date"
                                value={formData.departureDate}
                                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Hora de Salida</label>
                            <input
                                type="time"
                                value={formData.departureTime}
                                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Fecha de Regreso</label>
                            <input
                                type="date"
                                value={formData.returnDate}
                                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Hora de Regreso</label>
                            <input
                                type="time"
                                value={formData.returnTime}
                                onChange={(e) => setFormData({ ...formData, returnTime: e.target.value })}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Pasajeros *</label>
                            <input
                                type="number"
                                value={formData.passengers}
                                onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                                min="1"
                                max="9"
                                required
                            />
                        </div>
                    </div>

                    {error && <div className={styles.errorMessage}>{error}</div>}
                    {success && <div className={styles.successMessage}>{success}</div>}

                    <button type="submit" className={styles.submitBtn}>
                        Guardar Reserva
                    </button>
                </form>
            )}

            <div className={styles.bookingsList}>
                {loading ? (
                    <div className={styles.emptyState}>Cargando reservas...</div>
                ) : bookings.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Plane size={48} />
                        <p>No tienes reservas guardadas</p>
                        <p className={styles.emptyHint}>Agrega tu primera reserva de Gol</p>
                    </div>
                ) : (
                    bookings.map((booking) => (
                        <div key={booking.id} className={styles.bookingCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.pnrBadge}>{booking.pnrCode}</div>
                                <div className={styles.statusBadge}>{booking.status}</div>
                            </div>

                            <div className={styles.routeInfo}>
                                <div className={styles.location}>{booking.origin}</div>
                                <Plane className={styles.planeIcon} />
                                <div className={styles.location}>{booking.destination}</div>
                            </div>

                            <div className={styles.cardDetails}>
                                <div className={styles.detailItem}>
                                    <Calendar size={16} />
                                    <span>
                                        {format(new Date(booking.departureDate), "d 'de' MMMM, yyyy", { locale: es })}
                                        {booking.departureTime && ` - ${booking.departureTime}`}
                                    </span>
                                </div>

                                {booking.returnDate && (
                                    <div className={styles.detailItem}>
                                        <Calendar size={16} />
                                        <span>
                                            Regreso: {format(new Date(booking.returnDate), "d 'de' MMMM", { locale: es })}
                                            {booking.returnTime && ` - ${booking.returnTime}`}
                                        </span>
                                    </div>
                                )}

                                <div className={styles.detailItem}>
                                    <Users size={16} />
                                    <span>{booking.passengers} {booking.passengers === 1 ? 'pasajero' : 'pasajeros'}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
