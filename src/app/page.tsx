import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Countdown from '@/components/Countdown/Countdown';
import CurrencyConverter from '@/components/CurrencyConverter/CurrencyConverter';
import WeatherWidget from '@/components/WeatherWidget/WeatherWidget';
import FlightManager from '@/components/FlightManager/FlightManager';
import { LogOut, User } from 'lucide-react';
import styles from './page.module.css';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    redirect('/login');
  }

  // En una app real, aquí verificaríamos el token y obtendríamos el usuario
  // Para la demo, asumimos que si hay token, el usuario está "logeado"

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.nav}>
            <h1 className={styles.logo}>Brasil 2026</h1>
            <div className={styles.userMenu}>
              <div className={styles.userInfo}>
                <User size={20} />
                <span>Mi Perfil</span>
              </div>
              <form action={async () => {
                'use server';
                const { cookies } = await import('next/headers');
                (await cookies()).delete('token');
              }}>
                <button type="submit" className={styles.logoutBtn}>
                  <LogOut size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className={styles.heroSection}>
          <Countdown />
        </div>

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
  );
}
