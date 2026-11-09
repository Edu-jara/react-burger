import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GestionProductos from './GestionProductos'; 
import GestionCupon from './GestionCupones';
import Footer from '../../components/layout/Footer';

export default function ControlGestion() {
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

            {/* Header / Navbar Responsivo */}
            <header className="bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 px-4 py-3 md:px-6 md:py-4 sticky top-0 z-40 space-y-3 md:space-y-0">
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    
                    {/* 1. IZQUIERDA: Marca + Botón "Ver Tienda" (Corregido w-md por w-full) */}
                    <div className="flex items-center justify-between w-full md:w-auto gap-4">
                        <h1 className="text-sm md:text-lg font-black tracking-wide text-zinc-100 flex items-center gap-2">
                            <span>🛠️</span> Control de Gestión
                        </h1>
                        
                        <Link
                            to="/menu"
                            className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                        >
                            <span>👁️</span> Ver Tienda
                        </Link>
                    </div>

                    {/* 2. CENTRO: Selector de Pestañas (Tabs) (Corregido w-md por w-full) */}
                    <div className="flex items-center w-full md:w-auto bg-zinc-950 p-1 rounded-xl border border-zinc-800/80">
                        <button
                            onClick={() => setPestanaActiva('productos')}
                            className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                                pestanaActiva === 'productos'
                                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                            }`}
                        >
                            Productos
                        </button>

                        <button
                            onClick={() => setPestanaActiva('cupones')}
                            className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                                pestanaActiva === 'cupones'
                                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                            }`}
                        >
                            🔥 Cupones
                        </button>
                    </div>

                    {/* 3. DERECHA: Usuario Activo + Botón Cerrar Sesión (Corregido w-md por w-full) */}
                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
                        {user && (
                            <span className="text-xs text-zinc-400 truncate max-w-[160px]" title={user.email}>
                                {user.email}
                            </span>
                        )}
                        
                        <button
                            onClick={handleLogout}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0"
                        >
                            Cerrar Sesión
                        </button>
                    </div>

                </div>

            </header>

            {/* Contenido dinámico */}
            <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
                {pestanaActiva === 'productos' && <GestionProductos />}
                {pestanaActiva === 'cupones' && <GestionCupon />}
            </main>

            <Footer />

        </div>
    );
}