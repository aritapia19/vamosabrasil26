'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Countdown from '@/components/Countdown/Countdown';
import { verifyToken } from '@/lib/jwt';
import { useCarousel } from '@/context/CarouselContext';
import styles from './Header.module.css';
import { useEffect, useState } from 'react';

export default function Header() {
    const router = useRouter();
    const { currentImage } = useCarousel(); // Mantenemos para otros usos si fuera necesario, pero el fondo ahora es lógico
    const [userName, setUserName] = useState('Usuario');
    const [hasToken, setHasToken] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
            });
            router.push('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <header
            className={`${styles.header} ${isScrolled ? styles.scrolled : styles.initial}`}
        >
            {/* Backdrop removido o ajustado por CSS si es necesario, la lógica ahora es color sólido vs transparente */}
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
                        <button
                            onClick={handleLogout}
                            className={styles.logoutBtn}
                            aria-label="Cerrar sesión"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
