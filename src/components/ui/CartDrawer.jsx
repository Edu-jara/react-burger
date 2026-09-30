import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
    const {
        cart,
        isCartOpen,
        setIsCartOpen,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        sendOrderToWhatsApp
    } = useCart();

    const [form, setForm] = useState({
        nombre: '',
        direccion: '',
        metodoPago: 'Efectivo',
        notas: ''
    });

    // Cierre del drawer mediante la tecla Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isCartOpen) {
                setIsCartOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isCartOpen, setIsCartOpen]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.nombre.trim() || !form.direccion.trim()) {
            alert('Por favor completa tu nombre y dirección de entrega.');
            return;
        }

        sendOrderToWhatsApp(form);
        clearCart();
        setForm({
            nombre: '',
            direccion: '',
            metodoPago: 'Efectivo',
            notas: ''
        });
        setIsCartOpen(false);
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
                    {/* Backdrop / Fondo oscuro con animación  */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setIsCartOpen(false)}
                    />

                    {/* Panel Lateral Deslizante */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-md bg-zinc-900 border-l border-zinc-800 h-full flex flex-col z-10 shadow-2xl"
                    >
                        {/* Header del Carrito */}
                        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🛒</span>
                                <h3 className="text-lg font-bold text-white">Tu Pedido</h3>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-zinc-400 hover:text-white bg-zinc-800 p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                                ✕ Cerrar
                            </button>
                        </div>

                        {/* Cuerpo: Lista de Productos */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cart.length === 0 ? (
                                <div className="text-center py-12 text-zinc-500">
                                    <span className="text-4xl block mb-2">🍔</span>
                                    <p className="text-base font-medium">El carrito está vacío</p>
                                    <p className="text-xs mt-1">¡Agregá algo rico del menú!</p>
                                </div>
                            ) : (
                                cart.map((item) => {
                                    const precioNum = Number(item.precio) || 0;
                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80"
                                        >
                                            <div className="flex-1 min-w-0 mr-3">
                                                <h4 className="text-sm font-bold text-white truncate">{item.nombre}</h4>
                                                <p className="text-xs text-amber-500 font-semibold mt-0.5">
                                                    ${(precioNum * item.quantity).toLocaleString('es-AR')}
                                                </p>
                                            </div>

                                            {/* Controles de cantidad */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="w-7 h-7 bg-zinc-800 text-zinc-300 font-bold rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center text-xs cursor-pointer"
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm font-bold text-white w-4 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="w-7 h-7 bg-amber-500 text-zinc-950 font-bold rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center text-xs cursor-pointer"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-zinc-500 hover:text-red-400 text-xs ml-1 transition-colors cursor-pointer"
                                                    title="Eliminar producto"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer: Formulario & Envío de Pedido */}
                        {cart.length > 0 && (
                            <div className="p-4 border-t border-zinc-800 bg-zinc-950 space-y-3">
                                <div className="flex items-center justify-between text-base font-extrabold text-white">
                                    <span>Total:</span>
                                    <span className="text-amber-500 text-lg">${cartTotal.toLocaleString('es-AR')}</span>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t border-zinc-800">
                                    <input
                                        type="text"
                                        name="nombre"
                                        placeholder="Tu Nombre *"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                                    />
                                    <input
                                        type="text"
                                        name="direccion"
                                        placeholder="Dirección de entrega *"
                                        value={form.direccion}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                                    />
                                    <div className="flex gap-2">
                                        <select
                                            name="metodoPago"
                                            value={form.metodoPago}
                                            onChange={handleChange}
                                            className="w-1/2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                                        >
                                            <option value="Efectivo">Efectivo</option>
                                            <option value="Mercado Pago">Mercado Pago</option>
                                            <option value="Tarjeta">Tarjeta</option>
                                        </select>
                                        <input
                                            type="text"
                                            name="notas"
                                            placeholder="Notas (sin cebolla...)"
                                            value={form.notas}
                                            onChange={handleChange}
                                            className="w-1/2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg text-sm mt-2 cursor-pointer"
                                    >
                                        <span>📲</span> Enviar Pedido a WhatsApp
                                    </button>
                                </form>

                                <button
                                    type="button"
                                    onClick={clearCart}
                                    className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 transition-colors py-1 cursor-pointer"
                                >
                                    Vaciar Carrito
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}