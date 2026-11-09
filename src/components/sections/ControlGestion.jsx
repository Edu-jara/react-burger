import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiTool, FiEye, FiLogOut, FiBox, FiTag } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import GestionProductos from './GestionProductos'; 
import GestionCupon from './GestionCupones';
import Footer from '../../components/layout/Footer';

export default function ControlGestion() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [pestanaActiva, setPestanaActiva] = useState('productos');

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
        <div className="bg-zinc-950 min-h-screen text-zinc-100 flex flex-col justify-between selection:bg-amber-500 selection:text-zinc-950">
            
            {/* React Helmet para SEO y título de la pestaña exigido por el curso */}
            <Helmet>
                <title>Control de Gestión | Panel de Administración</title>
                <meta name="description" content="Panel de control para la gestión de productos y cupones de la e-commerce." />
            </Helmet>

            {/* Contenedor superior (Header + Main) */}
            <div>
                {/* Header / Navbar Responsivo */}
                <header className="bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 px-4 py-3 md:px-6 md:py-4 sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        
                        {/* IZQUIERDA: Marca + Ver Tienda */}
                        <div className="flex items-center justify-between w-full md:w-auto gap-4">
                            <h1 className="text-sm md:text-lg font-black tracking-wide text-zinc-100 flex items-center gap-2">
                                <FiTool className="text-amber-500 text-lg" /> Control de Gestión
                            </h1>
                            
                            <Link
                                to="/menu"
                                className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                            >
                                <FiEye /> Ver Tienda
                            </Link>
                        </div>

                        {/* CENTRO: Selector de Pestañas con React Icons */}
                        <div className="flex items-center w-full md:w-auto bg-zinc-950 p-1 rounded-xl border border-zinc-800/80">
                            <button
                                onClick={() => setPestanaActiva('productos')}
                                className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                                    pestanaActiva === 'productos'
                                        ? 'bg-amber-500 text-zinc-950 shadow-md'
                                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                                }`}
                            >
                                <FiBox /> Productos
                            </button>

                            <button
                                onClick={() => setPestanaActiva('cupones')}
                                className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                                    pestanaActiva === 'cupones'
                                        ? 'bg-amber-500 text-zinc-950 shadow-md'
                                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                                }`}
                            >
                                <FiTag /> Cupones
                            </button>
                        </div>

                        {/* DERECHA: Usuario + Logout */}
                        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
                            {user && (
                                <span className="text-xs text-zinc-400 truncate max-w-[160px]" title={user.email}>
                                    {user.email}
                                </span>
                            )}
                            
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0"
                            >
                                <FiLogOut /> Salir
                            </button>
                        </div>

                    </div>
                </header>

                {/* Contenido dinámico */}
                <main className="p-4 md:p-6 max-w-7xl w-full mx-auto">
                    {pestanaActiva === 'productos' && <GestionProductos />}
                    {pestanaActiva === 'cupones' && <GestionCupon />}
                </main>
            </div>

            {/* Footer unificado */}
            <Footer />

        </div>
    );
}