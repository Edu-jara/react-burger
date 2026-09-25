import React from 'react';
import { motion } from 'framer-motion';

export default function Nosotros() {
    // Tarjetas de valor destacadas
    const valores = [
        {
            
            titulo: 'Pasión Artesanal',
            descripcion: 'Cada plato se prepara al momento con recetas propias e ingredientes seleccionados.',
            imagen: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=600&q=80' // Fuego / Cocción
        },
        {
            
            titulo: 'Calidad Premium',
            descripcion: 'Trabajamos con productores locales para garantizar la máxima frescura en tu mesa.',
            imagen: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80' // Ingredientes frescos
        },
        {
            
            titulo: 'Entrega Veloz',
            descripcion: 'Empaques térmicos diseñados para que tu pedido llegue caliente y perfecto.',
            imagen: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=600&q=80' // Delivery / Empaque
        }
    ];
    return (
        <section id="nosotros" className="py-20 bg-zinc-950 text-white relative overflow-hidden">
            {/* Fondo sutil con luces de acento */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 relative z-10">

                {/* Encabezado de Sección */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-amber-500 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 inline-block mb-3">
                        Nuestra Historia
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
                        Cocinamos con alma, servimos con pasión
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                        Nacimos con la idea de llevar la verdadera experiencia gastronómica directamente a tu casa. Sin atajos, solo sabor auténtico.
                    </p>
                </div>

                {/* Bloque Principal: Historia e Imagen */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">

                    {/* Columna Izquierda: Texto e Identidad */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-7 space-y-6"
                    >
                        <h3 className="text-2xl font-bold text-amber-500">
                            Más que una cocina, una tradición en constante evolución.
                        </h3>
                        <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
                            Desde nuestros inicios, nos propusimos redefinir lo que significa comer bien. Combinamos técnicas tradicionales con un toque contemporáneo para crear sabores que sorprenden en cada bocado.
                        </p>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Nos obsesiona cada detalle: desde el tostado perfecto del pan hasta la temperatura exacta de entrega. Queremos que cada pedido sea una pausa especial en tu día.
                        </p>

                        {/* Métrica / Badge de confianza */}
                        <div className="pt-4 flex items-center gap-6 border-t border-zinc-800/80">
                            <div>
                                <span className="block text-3xl font-black text-white">+5.000</span>
                                <span className="text-xs text-zinc-500 uppercase tracking-wider">Pedidos Entregados</span>
                            </div>
                            <div className="h-8 w-px bg-zinc-800" />
                            <div>
                                <span className="block text-3xl font-black text-amber-500">4.9 ★</span>
                                <span className="text-xs text-zinc-500 uppercase tracking-wider">Calificación Clientes</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Columna Derecha: Imagen Destacada con Marco Estético */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-5 relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl group">
                            <img
                                src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80"
                                alt="Nuestra Cocina en Acción"
                                className="w-full h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                            {/* Card Flotante sobre la imagen */}
                            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800">
                                <p className="text-xs font-bold text-white">👨‍🍳 Hecho por Manos Expertas</p>
                                <p className="text-[11px] text-zinc-400">Calidad y dedicación garantizada en cada preparación.</p>
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* Grid de 3 Tarjetas de Valor */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {valores.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            whileHover={{ y: -6 }}
                            className="relative h-[260px] rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all duration-300 group shadow-xl flex flex-col justify-end p-6 cursor-pointer"
                        >
                            {/* 1. Imagen de fondo con zoom en hover */}
                            <img
                                src={item.imagen}
                                alt={item.titulo}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                            />

                            {/* 2. Capa oscura (Overlay) para legibilidad */}
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/30 group-hover:via-zinc-950/70 transition-colors duration-500" />

                            {/* 3. Contenido de la tarjeta (Al frente con z-10) */}
                            <div className="relative z-10">
                                
                                <h4 className="text-lg font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                                    {item.titulo}
                                </h4>

                                <p className="text-zinc-300 text-xs md:text-sm leading-relaxed">
                                    {item.descripcion}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}