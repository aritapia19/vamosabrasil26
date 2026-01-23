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

export default function Countdown() {
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
        <div className={styles.container}>
            <h2 className={styles.title}>Vamos a Brasil 2026</h2>
            <p className={styles.subtitle}>Falta muy poco para el gran viaje</p>

            <div className={styles.grid}>
                <div className={styles.item}>
                    <span className={styles.value}>{timeLeft.days}</span>
                    <span className={styles.label}>Días</span>
                </div>
                <div className={styles.item}>
                    <span className={styles.value}>{timeLeft.hours.toString().padStart(2, '0')}</span>
                    <span className={styles.label}>Horas</span>
                </div>
                <div className={styles.item}>
                    <span className={styles.value}>{timeLeft.minutes.toString().padStart(2, '0')}</span>
                    <span className={styles.label}>Min</span>
                </div>
                <div className={styles.item}>
                    <span className={styles.value}>{timeLeft.seconds.toString().padStart(2, '0')}</span>
                    <span className={styles.label}>Seg</span>
                </div>
            </div>
        </div>
    );
}
