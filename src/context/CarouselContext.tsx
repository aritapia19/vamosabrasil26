'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CarouselContextType {
    currentSlide: number;
    setCurrentSlide: (index: number) => void;
    currentImage: string;
    imageBrightness: 'light' | 'dark';
}

const CarouselContext = createContext<CarouselContextType | undefined>(undefined);

// Brightness mapping for each slide (manual, but accurate for our images)
const brightnessMap: Record<number, 'light' | 'dark'> = {
    0: 'dark',  // GOL - airplane interior
    1: 'light', // Traslado - bright outdoor
    2: 'light', // Pousada - bright building
    3: 'light', // Playas - bright beach
    4: 'dark',  // Barco - darker water scene
    5: 'dark',  // Noche - night scene
    6: 'light', // Arraial do Cabo - bright beach
    7: 'light', // Rio - Cristo Redentor daylight
};

const imageMap: Record<number, string> = {
    0: '/images/carousel/01_gol.jpg',
    1: '/images/carousel/02_traslado.jpg',
    2: '/images/carousel/03_pousada.jpg',
    3: '/images/carousel/04_playa.jpg',
    4: '/images/carousel/05_barco.jpg',
    5: '/images/carousel/06_noche.jpg',
    6: '/images/carousel/07_cabofrio.JPG',
    7: '/images/carousel/08_rio.jpg',
};

export function CarouselProvider({ children }: { children: ReactNode }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const value: CarouselContextType = {
        currentSlide,
        setCurrentSlide,
        currentImage: imageMap[currentSlide],
        imageBrightness: brightnessMap[currentSlide],
    };

    return (
        <CarouselContext.Provider value={value}>
            {children}
        </CarouselContext.Provider>
    );
}

export function useCarousel() {
    const context = useContext(CarouselContext);
    if (context === undefined) {
        throw new Error('useCarousel must be used within a CarouselProvider');
    }
    return context;
}
