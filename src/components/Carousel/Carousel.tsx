'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Carousel.module.css';

const slides = [
    {
        id: 1,
        image: '/images/carousel/01_gol.jpg',
        title: '01 GOL',
        description: 'Vuela con comodidad y seguridad en nuestra aerolínea asociada para comenzar tu aventura.'
    },
    {
        id: 2,
        image: '/images/carousel/02_traslado.jpg',
        title: '02 Traslado',
        description: 'Servicio exclusivo de InBuzios para llevarte directo a tu descanso sin preocupaciones.'
    },
    {
        id: 3,
        image: '/images/carousel/03_pousada.jpg',
        title: '03 Pousada Villegagnon',
        description: 'Tu hogar lejos de casa. Confort, ubicación ideal y la mejor atención en Búzios.'
    },
    {
        id: 4,
        image: '/images/carousel/04_playa.jpg',
        title: '04 Playas',
        description: 'Descubre las playas paradisíacas de arena blanca y aguas cristalinas de Búzios.'
    },
    {
        id: 5,
        image: '/images/carousel/05_barco.jpg',
        title: '05 Barco',
        description: 'Excursiones inolvidables navegando por la costa y conociendo las mejores vistas.'
    },
    {
        id: 6,
        image: '/images/carousel/06_noche.jpg',
        title: '06 Noche en Búzios',
        description: 'Vive la magia de Rua das Pedras, gastronomía, música y diversión nocturna.'
    },
    {
        id: 7,
        image: '/images/carousel/07_cabofrio.jpg',
        title: '07 Arraial do Cabo',
        description: 'Una escapada imprescindible al "Caribe Brasileño", naturaleza en estado puro.'
    },
    {
        id: 8,
        image: '/images/carousel/08_rio.jpg',
        title: '08 Rio de Janeiro',
        description: 'La Ciudad Maravillosa te espera con sus iconos mundiales y energía única.'
    }
];

export default function Carousel() {
    const [current, setCurrent] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, []);

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <div className={styles.carouselContainer}>
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`${styles.slide} ${index === current ? styles.active : ''}`}
                >
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className={styles.image}
                        priority={index === 0}
                    />
                    <div className={styles.overlay}>
                        <h2 className={styles.title}>{slide.title}</h2>
                        <p className={styles.description}>{slide.description}</p>
                    </div>
                </div>
            ))}

            <div className={styles.controls}>
                <button onClick={prevSlide} className={styles.controlBtn} aria-label="Anterior">
                    <ChevronLeft size={24} />
                </button>
                <button onClick={nextSlide} className={styles.controlBtn} aria-label="Siguiente">
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className={styles.indicators}>
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`${styles.indicator} ${index === current ? styles.active : ''}`}
                        onClick={() => setCurrent(index)}
                    />
                ))}
            </div>
        </div>
    );
}
