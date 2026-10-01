import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import burgerVideo from '../../assets/hamburguesa.mp4';
import pizzaVideo from '../../assets/pizza.mp4';
import empanadasVideo from '../../assets/empanada.mp4';

//  array fuera del componente para evitar recreaciones en memoria
const SLIDES = [
    {
        title: "El sabor real de una Burger Perfecta.",
        subtitle: "100% Artesanales & Smashed",
        description: "Carne seleccionada, pan brioche tostado en su punto justo y nuestros secretos de la casa. Pedí online y recibilo caliente.",
        videoUrl: burgerVideo,
    },
    {
        title: "Pizzas de masa madre al horno de piedra.",
        subtitle: "Estilo Napolitano Auténtico",
        description: "Fior di latte, albahaca fresca y salsa de tomates caseros madurados al sol. Una explosión de sabor italiano en cada porción.",
        videoUrl: pizzaVideo,
    },
    {
        title: "Empanadas jugosas cortadas a cuchillo.",
        subtitle: "Horneadas en el momento",
        description: "Carne suave, cebolla de verdeo, huevo y aceitunas, envueltas en nuestra masa casera dorada y crujiente.",
        videoUrl: empanadasVideo,
    }
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef(null);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % SLIDES.length);
    }, []);

    // Función para navegación manual por dots
    const handleDotClick = (index) => {
        setCurrentSlide(index);
    };

    // Timer para autoscroll de diapositivas
    useEffect(() => {
        if (isPaused) return;

        timerRef.current = setInterval(() => {
            nextSlide();
        }, 9000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPaused, nextSlide]);

    return (
        <section
            id="inicio"
            className="relative min-h-[60vh] md:min-h-[85vh] pt-16 flex items-center justify-center text-zinc-100 overflow-hidden border-b border-zinc-800 bg-zinc-950"
        >
            {/* Botón flotante manual de Play/Pause */}
            <button
                onClick={() => setIsPaused(!isPaused)}
                className="absolute top-20 right-4 z-30 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-md transition-colors flex items-center gap-2 shadow-lg"
            >
                <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                {isPaused ? 'Reanudar' : 'Pausar'}
            </button>

            {/* Capa de Videos: Renderizamos los 3 videos simultáneamente y alternamos opacidad */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-950">
                {SLIDES.map((slide, index) => (
                    <video
                        key={slide.videoUrl}
                        src={slide.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className={`absolute inset-0 h-full w-full object-contain object-top md:object-cover md:object-center transition-opacity duration-700 ease-in-out ${
                            currentSlide === index ? 'opacity-90 z-10' : 'opacity-0 z-0'
                        }`}
                    />
                ))}
                
                {/* Capa de degradado para legibilidad sobre los videos */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent z-20" />
            </div>

            {/* Contenido de texto */}
            <div className="max-w-7xl mx-auto px-4 pt-20 pb-8 md:py-16 relative z-30 w-full flex flex-col items-start justify-end md:justify-center min-h-[500px] md:min-h-0">
                <div className="max-w-2xl space-y-3 md:space-y-6 text-left">
                    <span className="inline-block bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-amber-500/30 backdrop-blur-sm">
                        {SLIDES[currentSlide].subtitle}
                    </span>

                    <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight md:leading-none drop-shadow-md">
                        {SLIDES[currentSlide].title}
                    </h1>

                    <p className="text-zinc-200 text-sm sm:text-lg max-w-xl drop-shadow">
                        {SLIDES[currentSlide].description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 pt-2 md:pt-4 w-full sm:w-auto">
                        <Link
                            to="/menu"
                            className="w-full sm:w-auto bg-amber-500 text-zinc-950 font-bold px-8 py-3.5 md:py-4 rounded-xl hover:bg-amber-400 transition-colors text-center shadow-xl shadow-amber-500/20 text-sm md:text-base"
                        >
                            Ver Menú y Pedir
                        </Link>
                        <a
                            href="#nosotros"
                            className="w-full sm:w-auto bg-zinc-900/80 backdrop-blur-md text-zinc-100 border border-zinc-700 font-medium px-8 py-4 rounded-xl hover:bg-zinc-800 transition-colors text-center text-sm md:text-base"
                        >
                            Conocer más
                        </a>
                    </div>
                </div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                            currentSlide === index ? 'w-8 bg-amber-500' : 'w-2.5 bg-zinc-600'
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}