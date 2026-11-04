import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GestionProductos from './GestionProductos'; 
import GestionCupon from './GestionCupones';

export default function ControlGestion() {
    // 1. Inyectamos la sesión y la función de logout
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [pestanaActiva, setPestanaActiva] = React.useState('productos');

    const handleLogout = async () => {
        const confirmar = window.confirm("¿Desea cerrar sesión?");
        if (!confirmar) return;

        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <div className="bg-zinc-950 min-h-screen text-zinc-100 selection:bg-amber-500 selection:text-zinc-950 flex flex-col">

            {/* Header / Navbar interno del Admin (Nivel Senior) */}
            <header className="bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-40">
                
                {/* 1. IZQUIERDA: Marca + Botón "Ver Tienda" */}
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-black tracking-wide text-zinc-100 flex items-center gap-2">
                        <span>🛠️</span> Control de Gestión
                    </h1>
                    
                    <Link
                        to="/menu"
                        className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                    >
                        <span>👁️</span> Ver Tienda
                    </Link>
                </div>

                {/* 2. CENTRO: Selector de Pestañas (Tabs) */}
                <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800/80">
                    <button
                        onClick={() => setPestanaActiva('productos')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            pestanaActiva === 'productos'
                                ? 'bg-amber-500 text-zinc-950 shadow-md'
                                
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                        }`}
                    >
                        Productos
                    </button>

                    <button
                        onClick={() => setPestanaActiva('cupones')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            pestanaActiva === 'cupones'
                                ? 'bg-amber-500 text-zinc-950 shadow-md'
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                        }`}
                    >
                        🔥 Cupones
                    </button>
                </div>

                {/* 3. DERECHA: Usuario Activo + Botón Cerrar Sesión */}
                <div className="flex items-center gap-3">
                    {user && (
                        <span className="hidden sm:inline text-xs text-zinc-400 max-w-[140px] truncate" title={user.email}>
                            {user.email}
                        </span>
                    )}
                    
                    <button
                        onClick={handleLogout}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                    >
                        Cerrar Sesión
                    </button>
                </div>

            </header>

            {/* Contenido dinámico */}
            <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
                {pestanaActiva === 'productos' && <GestionProductos />}
                {pestanaActiva === 'cupones' && <GestionCupon />}
            </main>

        </div>
    );
}