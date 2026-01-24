'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import styles from '../login/auth-page.module.css';
import authStyles from '@/components/Auth/Auth.module.css';

export default function RecoveryPage() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/recovery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error al solicitar recuperación');
            }

            setSent(true);
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
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
                                disabled={loading}
                            />
                        </div>

                        {error && <div style={{ color: 'red', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</div>}

                        <button type="submit" className={authStyles.submitBtn} disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar Instrucciones'}
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
