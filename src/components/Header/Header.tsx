import { cookies } from 'next/headers';
import { LogOut } from 'lucide-react';
import Countdown from '@/components/Countdown/Countdown';
import { verifyToken } from '@/lib/jwt';
import styles from './Header.module.css';

export default async function Header() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    let userName = 'Usuario';

    if (token) {
        const decoded = verifyToken(token.value);
        if (decoded && typeof decoded === 'object' && 'name' in decoded) {
            userName = (decoded.name as string) || 'Usuario';
        }
    }

    return (
        <header className={styles.header}>
            <div className={styles.nav}>
                <div className={styles.left}>
                    <h1 className={styles.logo}>BUZIOS</h1>
                    <div className={styles.countdownWrapper}>
                        <Countdown compact={true} />
                    </div>
                </div>

                {token && (
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
