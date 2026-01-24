import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Countdown from '@/components/Countdown/Countdown';
import CurrencyConverter from '@/components/CurrencyConverter/CurrencyConverter';
import WeatherWidget from '@/components/WeatherWidget/WeatherWidget';
import FlightManager from '@/components/FlightManager/FlightManager';
import Carousel from '@/components/Carousel/Carousel';
import Header from '@/components/Header/Header';
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
      <Header />

      <div className={styles.carouselSection}>
        <Carousel />
      </div>

      <div className="container">
        {/* El Countdown viejo estaba aquí, ahora está en el Header. 
            Podemos dejarlo aquí también si se quiere grande, pero la solicitud 
            decía "que el contador esté como top bar". Lo comentaré o eliminaré 
            de aquí para evitar duplicidad visual excesiva, o dejaré solo el Header.
            Decisión: Eliminar de aquí ya que está en el Header.
        */}

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
