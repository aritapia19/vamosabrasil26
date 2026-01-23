'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import styles from '../login/auth-page.module.css';
import authStyles from '@/components/Auth/Auth.module.css';

export default function RecoveryPage() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulación de envío
        setSent(true);
    };

    return (
        <div className={styles.authWrapper}>
            <div className={authStyles.authCard}>
                <div className={authStyles.header}>
                    <div className={authStyles.iconCircle}>
                        {sent ? <CheckCircle className={authStyles.icon} style={{ color: 'var(--success)' }} /> : <Mail className={authStyles.icon} />}
                    </div>
                    <h2>{sent ? '¡Enviado!' : 'Recuperar Cuenta'}</h2>
                    <p>
                        {sent
                            ? 'Si el correo existe, recibirás un link de recuperación en breve.'
                            : 'Ingresa tu email para recibir instrucciones'}
                    </p>
                </div>

                {!sent ? (
                    <form onSubmit={handleSubmit} className={authStyles.form}>
                        <div className={authStyles.inputGroup}>
                            <label htmlFor="email">Email de registro</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="correo@ejemplo.com"
                                required
                            />
                        </div>

                        <button type="submit" className={authStyles.submitBtn}>
                            Enviar Instrucciones
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <Link href="/login" className={authStyles.submitBtn} style={{ textDecoration: 'none' }}>
                            Volver al Login
                        </Link>
                    </div>
                )}

                <div className={authStyles.footer}>
                    <Link href="/login" className={authStyles.forgot}>
                        <ArrowLeft size={12} style={{ marginRight: '4px' }} /> Volver
                    </Link>
                </div>
            </div>
        </div>
    );
}
