import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenu } from '../../context/MenuContext';
import ProductCard from '../ui/ProductCard';
import { useFavorites } from '../../context/FavoritesContext';
import styles from './Menu.module.css';


const Menu = () => {
    //  Contexto de Favoritos
    const { favoritesCount = 0, isFavorite } = useFavorites();

    //  Contexto del Menú (Conectado a Firestore)
    const menuContext = useMenu() || {};
    const {
        cargando,
        error,
        productos = [],          // Data plana completa de Firestore
        productosFiltrados = [], // Productos ya listos y filtrados para renderizar
        searchQuery = '',
        setSearchQuery = () => { },
        selectedCategory: categoriaActiva,
        setSelectedCategory: setCategoriaActiva
    } = menuContext;

    // Sube la pantalla arriba cada vez que hacés clic en una pestaña
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Salto instantáneo
        });
    }, [categoriaActiva]);

    useEffect(() => {
        // Solo actuamos si hay texto real (más de 1 carácter)
        if (searchQuery.trim().length > 1) {

            // Esperamos 250ms a que el usuario termine de tipear la palabra
            const timer = setTimeout(() => {
                window.scrollTo({
                    top: 160,
                    behavior: 'smooth'
                });
            }, 250);

            // Limpiamos el timer anterior si sigue tipeando antes de los 250ms
            return () => clearTimeout(timer);
        }
        // Si se limpió la búsqueda (searchQuery está vacío), vuelve arriba de todo
        else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [searchQuery]);

    //  Calculamos las secciones según la categoría activa
    const seccionesAmostrar = useMemo(() => {
        // Caso 1: Favoritos
        if (categoriaActiva === 'favorites') {
            const itemsFavoritos = productos.filter(item => isFavorite(item.id));
            if (itemsFavoritos.length === 0) return [];

            return [{
                id: 'favorites-section',
                titulo: '❤️ Tus Favoritos',
                datos: itemsFavoritos
            }];
        }

        // Caso 2: Agrupar la lista plana de productosFiltrados por categoría
        const agrupados = productosFiltrados.reduce((acc, producto) => {
            const catKey = producto.categoria || 'varios';
            if (!acc[catKey]) {
                acc[catKey] = {
                    id: catKey,
                    titulo: catKey.charAt(0).toUpperCase() + catKey.slice(1), // Capitaliza primera letra
                    datos: []
                };
            }
            acc[catKey].datos.push(producto);
            return acc;
        }, {});

        return Object.values(agrupados);
    }, [categoriaActiva, productos, productosFiltrados, isFavorite]);

    //  PANTALLA DE CARGA
    if (cargando) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-white pt-12">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-zinc-400 font-medium">Cargando nuestra carta...</p>
            </div>
        );
    }

    //  PANTALLA DE ERROR
    if (error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-red-400 p-4 pt-12">
                <p className="text-xl font-bold mb-2">⚠️ Hubo un problema al cargar el menú</p>
                <p className="text-zinc-400 text-sm">{error}</p>
            </div>
        );
    }

    //  RENDERIZADO PRINCIPAL
    return (
        <div id="menu" className={styles.containerMenu}>
            <div className={styles.headerMenuContainer}>
                <span className="inline-block text-[11px] md:text-xs font-black uppercase tracking-widest px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-1.5 md:mb-3">
                    Sabor & Calidad
                </span>
                {/* Tamaño compacto en celular, grande en computadoras */}
                <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mt-1 mb-1">
                    Nuestra Carta Exclusiva
                </h2>
                <div className={styles.decoracionLinea}>
                    <span className={styles.puntoCentral}></span>
                </div>
            </div>

            {/* CONTENEDOR UNIFICADO: Buscador + Tabs */}
            <div className="sticky top-16 z-30 bg-zinc-950/95 backdrop-blur-md pt-2 pb-3 border-b border-zinc-800/80 -mx-4 px-4 shadow-xl">

                {/* 1. BUSCADOR MÓVIL */}
                <div className="md:hidden mb-3">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="🔍 ¿Qué tenés ganas de comer?..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-4 pr-10 py-2.5 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 text-zinc-400 hover:text-white text-xs font-bold bg-zinc-800 rounded-full w-6 h-6 flex items-center justify-center"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>


                {/* 2. SUBMENÚ / TABS */}
                <div className={`${styles.submenu || 'flex gap-2 overflow-x-auto pb-1'} no-scrollbar`}>
                    <button
                        className={`${styles.tabBtn} ${categoriaActiva === 'todas' ? styles.active : ''}`}
                        onClick={() => setCategoriaActiva('todas')}
                    >
                        Todas
                    </button>

                    <button
                        className={`${styles.tabBtn} ${categoriaActiva === 'hamburguesas' ? styles.active : ''}`}
                        onClick={() => setCategoriaActiva('hamburguesas')}
                    >
                        Hamburguesas
                    </button>

                    <button
                        className={`${styles.tabBtn} ${categoriaActiva === 'pizzas' ? styles.active : ''}`}
                        onClick={() => setCategoriaActiva('pizzas')}
                    >
                        Pizzas
                    </button>

                    <button
                        className={`${styles.tabBtn} ${categoriaActiva === 'empanadas' ? styles.active : ''}`}
                        onClick={() => setCategoriaActiva('empanadas')}
                    >
                        Empanadas
                    </button>

                    {/* Botón "Favoritos" */}
                    <button
                        className={`${styles.tabBtn} ${categoriaActiva === 'favorites' ? styles.active : ''}`}
                        onClick={() => setCategoriaActiva('favorites')}
                    >
                        ❤️ Favoritos
                        {favoritesCount > 0 && (
                            <span className="ml-1.5 bg-amber-500 text-zinc-950 text-xs px-1.5 py-0.2 rounded-full font-black">
                                {favoritesCount}
                            </span>
                        )}
                    </button>
                </div>



            </div>

            {/* CONTENEDOR DE PRODUCTOS */}
            <div className="min-h-[60vh] pt-6">
                {seccionesAmostrar.length === 0 ? (
                    <div className="text-center py-16 text-zinc-400">
                        {categoriaActiva === 'favorites' ? (
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-5xl mb-3">💔</p>
                                <p className="text-lg font-bold text-white mb-1">
                                    No tenés favoritos guardados
                                </p>
                                <p className="text-sm text-zinc-500 max-w-sm">
                                    Explorá la carta y hacé clic en el corazón de las comidas que más te gusten para guardarlas acá.
                                </p>
                            </div>
                        ) : (
                            <p className="text-lg font-medium">
                                {searchQuery
                                    ? `No encontramos platos que coincidan con "${searchQuery}" 😢`
                                    : "No hay productos disponibles por el momento."}
                            </p>
                        )}
                    </div>
                ) : (
                    seccionesAmostrar.map(cat => (
                        <section className={styles.seccion} key={cat.id}>
                            <h3 className={styles.tituloCategoria}>{cat.titulo}</h3>
                            <div className={styles.gridProductos}>
                                <AnimatePresence mode="popLayout">
                                    {(cat.datos || []).map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{
                                                opacity: 0,
                                                scale: 0.8,
                                                transition: { duration: 0.25, ease: 'easeIn' }
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ProductCard item={item} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </section>
                    ))
                )}
            </div>
        </div >
    );
};

export default Menu;