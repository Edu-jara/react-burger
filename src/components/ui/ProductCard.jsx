import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useFavorites } from '../../context/FavoritesContext';
import styles from '../sections/Menu.module.css';

export default function ProductCard({ item }) {
    const { addToCart, updateQuantity, getItemQuantity } = useCart();
    const { addToast } = useToast();
    const { isFavorite, toggleFavorite } = useFavorites();

    const favorite = isFavorite(item.id);
    const quantity = getItemQuantity(item.id);

    const handleAgregar = () => {
        addToCart(item);
        addToast(`¡${item.nombre} agregada al carrito! 🍔`);
    };

    return (
        <div className={styles.card}>
            {/* Contenedor de la Imagen + Botón de Favoritos */}
            <div className={`${styles.imageContainer} relative group`}>
                <img src={item.imagen} alt={item.nombre} loading="lazy" />

                {/* Botón flotante de Favoritos con Framer Motion */}
                <motion.button
                    type="button"
                    whileTap={{ scale: 0.75 }}
                    /* Agregamos el movimiento hacia el costado con rotate: [-15, 10, -5, 0] */
                    animate={
                        favorite
                            ? {
                                scale: [1, 1.35, 0.9, 1],
                                rotate: [0, -15, 10, -5, 0], // <- Latido con inclinación hacia los costados
                            }
                            : { scale: 1, rotate: 0 }
                    }
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);

                        if (!favorite) {
                            addToast(`${item.nombre} agregado a Favoritos`, '❤️');
                        } else {
                            addToast(`Quitado de Favoritos`, '🤍');
                        }
                    }}
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md border transition-colors duration-300 cursor-pointer ${favorite
                        ? 'opacity-100 bg-rose-500/20 border-rose-500/50 text-rose-500'
                        : 'opacity-0 group-hover:opacity-100 bg-zinc-950/60 border-zinc-700/50 text-zinc-400 hover:text-white'
                        }`}
                    aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={favorite ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-4 h-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.575-4.683-4.575-2.008 0-3.722 1.226-4.317 2.96-.595-1.734-2.309-2.96-4.317-2.96C5.099 3.675 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                    </svg>
                </motion.button>
            </div>

            {/* Contenido de la Tarjeta */}
            <div className={styles.cardContent}>
                <div className="flex-1">
                    <h4 className="text-base font-bold text-white mb-1">{item.nombre}</h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-2">{item.descripcion}</p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-800/60">
                    <span className="text-amber-500 font-extrabold text-base">
                        ${parseFloat(item.precio || item.price).toLocaleString('es-AR')}
                    </span>

                    {/* Controles de Carrito */}
                    <div className="min-h-[36px] flex items-center justify-end">
                        <AnimatePresence mode="wait">
                            {quantity === 0 ? (
                                <motion.button
                                    key="btn-agregar"
                                    type="button"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileTap={{ scale: 0.93 }}
                                    onClick={handleAgregar}
                                    className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black px-3.5 py-1.5 rounded-xl text-xs transition-colors flex items-center gap-1 shadow-md cursor-pointer"
                                >
                                    <span className="text-sm font-black">+</span> Agregar
                                </motion.button>
                            ) : (
                                <motion.div
                                    key="btn-controles"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex items-center bg-zinc-950 border border-amber-500/40 rounded-xl p-0.5 gap-1.5 shadow-md"
                                >
                                    <motion.button
                                        type="button"
                                        whileTap={{ scale: 0.85 }}
                                        onClick={() => {
                                            updateQuantity(item.id, -1);
                                            if (quantity === 1) {
                                                addToast(`Quitado del carrito ${item.nombre} 🍔`, '🗑️');
                                            } else {
                                                addToast(`Quitaste una unidad de ${item.nombre} 🍔`, '🛒');
                                            }
                                        }}
                                        className="w-7 h-7 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-amber-500 font-black rounded-lg transition-all text-xs cursor-pointer"
                                    >
                                        -
                                    </motion.button>

                                    <span className="font-black text-amber-500 text-xs min-w-[1.2rem] text-center">
                                        {quantity}
                                    </span>

                                    <motion.button
                                        type="button"
                                        whileTap={{ scale: 0.85 }}
                                        onClick={() => {
                                            updateQuantity(item.id, 1);
                                            addToast(`Sumaste otra ${item.nombre}`);
                                        }}
                                        className="w-7 h-7 flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-lg transition-all text-xs cursor-pointer"
                                    >
                                        +
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}