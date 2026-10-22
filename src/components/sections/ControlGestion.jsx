import React, { useState } from 'react';
import GestionCupon from './GestionCupones';
import GestionProductos from './GestionProductos';

export default function ControlGestion() {
    // 1. Creamos un estado para saber qué pestaña está activa ('cupones' o 'productos')
    const [pestanaActiva, setPestanaActiva] = useState('cupones');

    return (
        <div className="bg-zinc-950 min-h-screen text-zinc-100 selection:bg-amber-500 selection:text-zinc-950 flex flex-col justify-between">
            
            {/* Header / Mini-Navbar interno del Admin */}
            <header className="bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">🛠️ Panel de Control</h1>
                
                {/* Botones para alternar pestañas */}
                <div className="flex gap-2">
                    <button 
                        onClick={() => setPestanaActiva('cupones')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            pestanaActiva === 'cupones' 
                                ? 'bg-amber-500 text-zinc-950' 
                                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        }`}
                    >
                        Cupones
                    </button>

                    <button 
                        onClick={() => setPestanaActiva('productos')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            pestanaActiva === 'productos' 
                                ? 'bg-amber-500 text-zinc-950' 
                                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        }`}
                    >
                        Productos
                    </button>
                </div>
            </header>

            {/* Contenido dinámico según el estado */}
            <main className="flex-1 p-6">
                {pestanaActiva === 'cupones' && <GestionCupon />}
                {pestanaActiva === 'productos' && <GestionProductos />}
            </main>

        </div>
    );
}