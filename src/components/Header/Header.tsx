import { cookies } from 'next/headers';
import { LogOut, User } from 'lucide-react';
import Countdown from '@/components/Countdown/Countdown';
import styles from './Header.module.css';

export default async function Header() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    // Simple check: if no token, we might not show user menu.
    // The previous implementation in page.tsx redirected if no token, 
    // so here we assume if we are rendering this on a protected page, token likely exists.

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
                            <User size={20} />
                            <span>Mi Perfil</span>
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
