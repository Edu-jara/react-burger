import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const BarraFinalizarCompra = ({ carrito = [], totalPrecio = 0, abrirModalCarrito }) => {
    console.log("Ítems del carrito:", carrito);
    
    // Suma  usando la propiedad 'quantity' de el CartContext
    const cantidadTotal = carrito.reduce((acc, item) => acc + (item.quantity || 0), 0);

    // Blindaje básico para asegurar que el precio siempre sea un número válido
    const precioSeguro = Number(totalPrecio) || 0;

    if (cantidadTotal === 0) return null;
    
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-neutral-900/95 border border-emerald-500/30 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl shadow-black/80 flex items-center justify-between z-40 backdrop-blur-md transition-all duration-300">

            {/* Lado Izquierdo: Info del carrito */}
            <div className="flex items-center gap-3">
                <div className="relative bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/30 text-emerald-400">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-neutral-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                        {cantidadTotal}
                    </span>
                </div>

                <div>
                    <p className="text-[11px] text-neutral-400 font-medium leading-none mb-1">
                        Tu pedido hasta ahora:
                    </p>
                    <p className="text-base sm:text-lg font-bold text-white leading-none">
                        ${totalPrecio.toLocaleString('es-AR')}
                    </p>
                </div>
            </div>

            {/* Lado Derecho: Botón de acción */}
            <button
                onClick={abrirModalCarrito}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-neutral-950 font-bold px-4 py-2.5 rounded-xl transition-all active:scale-95 text-xs sm:text-sm shadow-lg shadow-emerald-500/20"
            >
                <span>Finalizar Pedido</span>
                <ArrowRight className="w-4 h-4" />
            </button>

        </div>
    );
};

export default BarraFinalizarCompra;