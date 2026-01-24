'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Countdown from '@/components/Countdown/Countdown';
import CurrencyConverter from '@/components/CurrencyConverter/CurrencyConverter';
import WeatherWidget from '@/components/WeatherWidget/WeatherWidget';
import FlightManager from '@/components/FlightManager/FlightManager';
import Carousel from '@/components/Carousel/Carousel';
import Header from '@/components/Header/Header';
import { CarouselProvider } from '@/context/CarouselContext';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  // La validación de sesión ahora la maneja el middleware.ts
  // No necesitamos verificar la cookie del lado del cliente (que además fallaba por ser HttpOnly)


  return (
    <CarouselProvider>
      <main className={styles.main}>
        <Header />

        <div className={styles.carouselSection}>
          <Carousel />
        </div>

        <div className="container">
          <div className={styles.grid}>
            <section className={styles.section}>
              <CurrencyConverter />
            </section>

            <section className={styles.section}>
              <WeatherWidget />
            </section>
          </div>

          <div className={styles.wideSection}>
            <FlightManager />
          </div>
        </div>

        <footer className={styles.footer}>
          <p>© 2026 Vamos a Brasil - Hecho con ❤️ para la aventura</p>
        </footer>
      </main>
    </CarouselProvider>
  );
}
