'use client';

import { useState, useEffect } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import styles from './Countdown.module.css';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface CountdownProps {
    compact?: boolean;
}

export default function Countdown({ compact = false }: CountdownProps) {
    const targetDate = new Date('2026-04-08T00:00:00');
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            if (now >= targetDate) {
                clearInterval(timer);
                return;
            }

            const days = differenceInDays(targetDate, now);
            const hours = differenceInHours(targetDate, now) % 24;
            const minutes = differenceInMinutes(targetDate, now) % 60;
            const seconds = differenceInSeconds(targetDate, now) % 60;

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={compact ? styles.containerCompact : styles.container}>
            {!compact && (
                <>
                    <h2 className={styles.title}>Vamos a Brasil 2026</h2>
                    <p className={styles.subtitle}>Falta muy poco para el gran viaje</p>
                </>
            )}

            <div className={compact ? styles.gridCompact : styles.grid}>
                <div className={compact ? styles.itemCompact : styles.item}>
                    <span className={compact ? styles.valueCompact : styles.value}>{timeLeft.days}</span>
                    <span className={compact ? styles.labelCompact : styles.label}>Días</span>
                </div>
                <div className={compact ? styles.itemCompact : styles.item}>
                    <span className={compact ? styles.valueCompact : styles.value}>{timeLeft.hours.toString().padStart(2, '0')}</span>
                    <span className={compact ? styles.labelCompact : styles.label}>Horas</span>
                </div>
                <div className={compact ? styles.itemCompact : styles.item}>
                    <span className={compact ? styles.valueCompact : styles.value}>{timeLeft.minutes.toString().padStart(2, '0')}</span>
                    <span className={compact ? styles.labelCompact : styles.label}>Min</span>
                </div>
                <div className={compact ? styles.itemCompact : styles.item}>
                    <span className={compact ? styles.valueCompact : styles.value}>{timeLeft.seconds.toString().padStart(2, '0')}</span>
                    <span className={compact ? styles.labelCompact : styles.label}>Seg</span>
                </div>
            </div>
        </div>
    );
}
