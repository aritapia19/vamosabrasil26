'use client';

import { cookies } from 'next/headers';
import { LogOut } from 'lucide-react';
import Countdown from '@/components/Countdown/Countdown';
import { verifyToken } from '@/lib/jwt';
import { useCarousel } from '@/context/CarouselContext';
import styles from './Header.module.css';
import { useEffect, useState } from 'react';

export default function Header() {
    const { currentImage, imageBrightness } = useCarousel();
    const [userName, setUserName] = useState('Usuario');
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        // Get token on client side
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        };

        const token = getCookie('token');
        if (token) {
            setHasToken(true);
            const decoded = verifyToken(token);
            if (decoded && typeof decoded === 'object' && 'name' in decoded) {
                setUserName((decoded.name as string) || 'Usuario');
            }
        }
    }, []);

    return (
        <header
            className={`${styles.header} ${imageBrightness === 'light' ? styles.lightBg : styles.darkBg}`}
            style={{
                backgroundImage: `url(${currentImage})`,
            }}
        >
            <div className={styles.headerBackdrop} />
            <div className={styles.nav}>
                <div className={styles.left}>
                    <h1 className={styles.logo}>BUZIOS</h1>
                    <div className={styles.countdownWrapper}>
                        <Countdown compact={true} />
                    </div>
                </div>

                {hasToken && (
                    <div className={styles.userMenu}>
                        <div className={styles.userInfo}>
                            <span>Hola {userName}</span>
                        </div>
                        <form action={async () => {
                            'use server';
                            const { cookies } = await import('next/headers');
                            (await cookies()).delete('token');
                        }}>
                            <button type="submit" className={styles.logoutBtn} aria-label="Cerrar sesión">
                                <LogOut size={20} />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </header>
    );
}
