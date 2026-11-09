import React from 'react';

/**
 * Componente reutilizable para mostrar un indicador de carga (Spinner).
 * @param {string} texto - Mensaje opcional que acompaña al spinner. Por defecto es "Cargando...".
 * @param {boolean} pantallaCompleta - Define si el spinner ocupa toda la pantalla (true) o solo un contenedor (false).
 */
export default function LoadingSpinner({ texto = "Cargando...", pantallaCompleta = false }) {
    
    // 1. Definimos las clases de Tailwind de forma dinámica según la prop 'pantallaCompleta'
    const containerClasses = pantallaCompleta
        ? "fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-8" // Pantalla completa con fondo oscuro y efecto blur
        : "flex flex-col items-center justify-center p-8 space-y-4"; // Contenedor flexible común para secciones

    return (
        <div className={containerClasses}>
            {/* 2. Círculo giratorio (Spinner) */}
            {/* 'w-12 h-12' define el tamaño, 'rounded-full' lo hace redondo, y 'animate-spin' lo hace girar */}
            {/* El truco visual: tres bordes tenues (border-amber-500/20) y el borde superior fuerte (border-t-amber-500) */}
            <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
            
            {/* 3. Texto descriptivo dinámico */}
            {/* 'animate-pulse' le da un efecto de parpadeo suave y 'text-amber-400' mantiene la estética de tu app */}
            <p className="mt-4 text-sm font-semibold text-amber-400 tracking-wide animate-pulse">
                {texto}
            </p>
        </div>
    );
}