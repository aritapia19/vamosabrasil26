'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowLeft, Loader2 } from 'lucide-react';
import authStyles from '@/components/Auth/Auth.module.css';
import styles from '../login/auth-page.module.css';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!token) {
        return <div style={{ textAlign: 'center', color: 'red' }}>Token inválido o faltante.</div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error al restablecer contraseña');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={authStyles.authCard} style={{ textAlign: 'center' }}>
                <div className={authStyles.header}>
                    <div className={authStyles.iconCircle} style={{ background: 'var(--success-bg, #dcfce7)' }}>
                        <Lock className={authStyles.icon} style={{ color: 'var(--success, #16a34a)' }} />
                    </div>
                    <h2>¡Contraseña Actualizada!</h2>
                    <p>Has recuperado tu cuenta exitosamente.</p>
                    <p>Redirigiendo al login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={authStyles.authCard}>
            <div className={authStyles.header}>
                <div className={authStyles.iconCircle}>
                    <Lock className={authStyles.icon} />
                </div>
                <h2>Nueva Contraseña</h2>
                <p>Ingresa tu nueva contraseña</p>
            </div>

            <form onSubmit={handleSubmit} className={authStyles.form}>
                <div className={authStyles.inputGroup}>
                    <label htmlFor="password">Nueva Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={loading}
                    />
                </div>

                <div className={authStyles.inputGroup}>
                    <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={loading}
                    />
                </div>

                {error && <div className={authStyles.errorMessage}>{error}</div>}

                <button type="submit" disabled={loading} className={authStyles.submitBtn}>
                    {loading ? <Loader2 className={authStyles.spin} /> : 'Cambiar Contraseña'}
                </button>
            </form>

            <div className={authStyles.footer}>
                <Link href="/login" className={authStyles.forgot}>
                    <ArrowLeft size={12} style={{ marginRight: '4px' }} /> Volver al Login
                </Link>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className={styles.authWrapper}>
            <Suspense fallback={<div>Cargando...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
