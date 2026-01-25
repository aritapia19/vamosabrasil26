'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCarousel } from '@/context/CarouselContext';
import styles from './Carousel.module.css';

const slides = [
    {
        id: 6,
        image: '/images/carousel/06_noche.jpg',
        title: 'Noche en Búzios',
        description: 'Vive la magia de Rua das Pedras, gastronomía, música y diversión nocturna.'
    },
    {
        id: 8,
        image: '/images/carousel/08_rio.jpg',
        title: 'Rio de Janeiro',
        description: 'La Ciudad Maravillosa te espera con sus iconos mundiales y energía única.'
    },
    {
        id: 4,
        image: '/images/carousel/04_playa.jpg',
        title: 'Playas',
        description: 'Descubre las playas paradisíacas de arena blanca y aguas cristalinas de Búzios.'
    },
    {
        id: 1,
        image: '/images/carousel/01_gol.jpg',
        title: 'GOL AIRLINES',
        description: 'Vuela con comodidad y seguridad en nuestra aerolínea asociada para comenzar tu aventura.'
    },
    {
        id: 2,
        image: '/images/carousel/02_traslado.jpg',
        title: 'Traslado',
        description: 'Servicio exclusivo de InBuzios para llevarte directo a tu descanso sin preocupaciones.'
    },
    {
        id: 3,
        image: '/images/carousel/03_pousada.jpg',
        title: 'Pousada Villegagnon',
        description: 'Tu hogar lejos de casa. Confort, ubicación ideal y la mejor atención en Búzios.'
    },
    {
        id: 5,
        image: '/images/carousel/05_barco.jpg',
        title: 'Barco',
        description: 'Excursiones inolvidables navegando por la costa y conociendo las mejores vistas.'
    },
    {
        id: 7,
        image: '/images/carousel/07_cabofrio.JPG',
        title: 'Arraial do Cabo',
        description: 'Una escapada imprescindible al "Caribe Brasileño", naturaleza en estado puro.'
    }
];

export default function Carousel() {
    const { currentSlide, setCurrentSlide } = useCarousel();
    const [scrollDarkness, setScrollDarkness] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
    }, [currentSlide, setCurrentSlide]);

    const prevSlide = () => {
        setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
    };

    // Auto-advance carousel
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    // Scroll-based darkening effect
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // Darken from 0 to 1 over 500px of scroll
            const darkness = Math.min(scrollY / 500, 1);
            setScrollDarkness(darkness);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={styles.carouselContainer}>
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
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

            {/* Scroll-based darkening overlay */}
            <div
                className={styles.scrollOverlay}
                style={{ opacity: scrollDarkness }}
            />

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
                        className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
}
