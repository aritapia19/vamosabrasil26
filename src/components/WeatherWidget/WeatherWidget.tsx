'use client';

import { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, RefreshCw } from 'lucide-react';
import styles from './WeatherWidget.module.css';

interface WeatherData {
    location: string;
    temperature: number;
    feelsLike: number;
    condition: string;
    conditionIcon: string;
    humidity: number;
    windKph: number;
    lastUpdated: string;
    isFallback?: boolean;
}

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchWeather = async () => {
        setUpdating(true);
        try {
            const res = await fetch('/api/weather/buzios');
            const data = await res.json();
            setWeather(data);
        } catch (error) {
            console.error('Error fetching weather:', error);
        } finally {
            setLoading(false);
            setUpdating(false);
        }
    };

    useEffect(() => {
        fetchWeather();

        // Actualizar cada 15 minutos
        const interval = setInterval(fetchWeather, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Cargando clima...</div>
            </div>
        );
    }

    if (!weather) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <Cloud className={styles.icon} />
                    <div>
                        <h3 className={styles.title}>Clima en Búzios</h3>
                        <p className={styles.subtitle}>Brasil</p>
                    </div>
                </div>
                <button
                    onClick={fetchWeather}
                    disabled={updating}
                    className={styles.refreshBtn}
                    title="Actualizar"
                >
                    <RefreshCw className={`${styles.refreshIcon} ${updating ? styles.spinning : ''}`} />
                </button>
            </div>

            <div className={styles.weatherBody}>
                <div className={styles.mainInfo}>
                    <img
                        src={`https:${weather.conditionIcon}`}
                        alt={weather.condition}
                        className={styles.weatherIcon}
                    />
                    <div className={styles.tempGroup}>
                        <div className={styles.temperature}>{Math.round(weather.temperature)}°</div>
                        <div className={styles.condition}>{weather.condition}</div>
                    </div>
                </div>

                <div className={styles.details}>
                    <div className={styles.detailItem}>
                        <Cloud size={16} />
                        <span>Sensación: {Math.round(weather.feelsLike)}°C</span>
                    </div>
                    <div className={styles.detailItem}>
                        <Droplets size={16} />
                        <span>Humedad: {weather.humidity}%</span>
                    </div>
                    <div className={styles.detailItem}>
                        <Wind size={16} />
                        <span>Viento: {Math.round(weather.windKph)} km/h</span>
                    </div>
                </div>
            </div>

            {weather.isFallback && (
                <div className={styles.fallbackNote}>
                    Mostrando datos aproximados
                </div>
            )}
        </div>
    );
}
