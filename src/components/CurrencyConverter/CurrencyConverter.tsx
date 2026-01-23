'use client';

import { useState, useEffect } from 'react';
import { RefreshCcw, ArrowRightLeft } from 'lucide-react';
import styles from './CurrencyConverter.module.css';

export default function CurrencyConverter() {
    const [brl, setBrl] = useState<string>('1');
    const [ars, setArs] = useState<number>(0);
    const [rate, setRate] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [updating, setUpdating] = useState<boolean>(false);
    const [lastUpdate, setLastUpdate] = useState<string>('');

    const fetchRate = async () => {
        setUpdating(true);
        try {
            const res = await fetch('/api/currency');
            const data = await res.json();
            setRate(data.rate);
            setLastUpdate(new Date(data.date).toLocaleString());
        } catch (error) {
            console.error('Error fetching currency:', error);
        } finally {
            setLoading(false);
            setUpdating(false);
        }
    };

    useEffect(() => {
        fetchRate();
    }, []);

    useEffect(() => {
        if (rate) {
            const val = parseFloat(brl) || 0;
            setArs(val * rate);
        }
    }, [brl, rate]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <ArrowRightLeft className={styles.icon} />
                    <h3 className={styles.title}>Conversor de Moneda</h3>
                </div>
                <button
                    onClick={fetchRate}
                    disabled={updating}
                    className={styles.refreshBtn}
                >
                    <RefreshCcw className={`${styles.refreshIcon} ${updating ? styles.spinning : ''}`} />
                </button>
            </div>

            <div className={styles.converterBody}>
                <div className={styles.inputGroup}>
                    <label>Reales (BRL)</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="number"
                            value={brl}
                            onChange={(e) => setBrl(e.target.value)}
                            placeholder="0.00"
                            min="0"
                        />
                        <span className={styles.currency}>R$</span>
                    </div>
                </div>

                <div className={styles.divider}>
                    <div className={styles.line}></div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Pesos (ARS)</label>
                    <div className={styles.resultBox}>
                        <span className={styles.resultValue}>{ars.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                        <span className={styles.currency}>$</span>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <p>1 BRL = {rate.toFixed(2)} ARS</p>
                <p className={styles.timestamp}>Última actualización: {lastUpdate}</p>
            </div>
        </div>
    );
}
