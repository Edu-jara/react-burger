import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { SITE_CONFIG } from '../../config/constants';
import { useMenu } from '../../context/MenuContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';

import { useAuth } from '../../context/AuthContext';


export default function Navbar({ onOpenCupones }) {

    //  Extraemos el usuario actual y la función de logout desde el contexto
    const { user, logout } = useAuth();
    

    //  Función para manejar el cierre de sesión
    const handleLogout = async () => {

        // Mostramos un cartel nativo de confirmación
        const confirmar = window.confirm("¿Desea cerrar sesión?");
        
        if (!confirmar) return; // Si el usuario pone "Cancelar", no hacemos nada
        try {
            await logout();
            navigate('/'); // Al cerrar sesión, lo enviamos al Inicio
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Contextos
    const { searchQuery, setSearchQuery, setSelectedCategory } = useMenu();
    const { itemCount, setIsCartOpen } = useCart();
    const { favoritesCount } = useFavorites();

    // Handler unificado para "Inicio" (Subir arriba o ir a '/')
    const handleInicioClick = (e) => {
        setIsMenuOpen(false);

        if (location.pathname === '/') {
            if (e && e.preventDefault) e.preventDefault();

            // Un breve timeout asegura que el render de React no cancele el scroll en móvil
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
            }, 50);
        } else {
            navigate('/');
        }
    };

    // Estilos de NavLink activo
    const navLinkStyles = ({ isActive }) =>
        `text-sm font-medium transition-colors ${isActive ? 'text-amber-500 font-bold' : 'text-zinc-300 hover:text-amber-500'}`;

    const navLinkMobileStyles = ({ isActive }) =>
        `block text-sm font-medium py-1 transition-colors ${isActive ? 'text-amber-500 font-bold' : 'text-zinc-300 hover:text-amber-500'}`;

    // Handler Favoritos
    const handleFavoritesClick = () => {
        if (setSelectedCategory) {
            setSelectedCategory('favorites');
        }
        setIsMenuOpen(false);
        navigate('/menu');
    };

    // Handler Buscador
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        navigate('/menu');
    };

    // Combinamos los links normales de la config con el de administración si el usuario es admin
    const navLinks = [
        ...SITE_CONFIG.mainNav,
        ...(user?.rol === 'admin' ? [{ to: '/control', label: 'Gestión' }] : [])
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo + Enlaces PC */}
                <div className="flex items-center gap-8">
                    <Link
                        to="/"
                        onClick={handleInicioClick}
                        className="text-xl font-black text-amber-500 tracking-wider"
                    >
                        {SITE_CONFIG.nombre.toUpperCase()}
                    </Link>

                    {/* Enlaces PC */}
                    {/* Enlaces PC (Mapeando el array dinámico navLinks) */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={(e) => {
                                    if (link.to === '/') {
                                        handleInicioClick(e);
                                    }
                                }}
                                className={navLinkStyles}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Buscador de Escritorio */}
                <div className="hidden md:block flex-1 max-w-xs mx-6">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Buscar hamburguesa, pizzas, empanadas..."
                            value={searchQuery}
                            onFocus={() => navigate('/menu')}
                            onChange={handleSearchChange}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-4 pr-10 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 text-zinc-400 hover:text-white text-xs font-bold bg-zinc-800 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Acciones */}
                {/* AUTENTICACIÓN EN ESCRITORIO */}
                
                <div className="flex items-center gap-3">

                    {/*  BOTÓN DE CUPONES EN LA BARRA PRINCIPAL */}
                    <button
                        type="button"
                        onClick={onOpenCupones}
                        className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold px-3 py-2 rounded-xl text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                        aria-label="Ver cupones de descuento"
                    >
                        <span>🔥</span>
                        <span className="hidden sm:inline">Cupones</span>
                    </button>

                    {/* Botón Favoritos */}
                    <button
                        type="button"
                        onClick={handleFavoritesClick}
                        className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-3 py-2 rounded-xl text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
                        aria-label="Ir a favoritos"
                    >
                        <span>❤️</span>
                        <span className="bg-zinc-950 text-amber-500 text-xs px-2 py-0.5 rounded-full font-black min-w-[20px] text-center">
                            {favoritesCount || 0}
                        </span>
                    </button>

                    {/* Carrito */}
                    <button
                        type="button"
                        onClick={() => setIsCartOpen(true)}
                        className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-3 py-2 rounded-xl text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
                        aria-label="Abrir carrito de compras"
                    >
                        <span>🛒</span>
                        <span className="bg-zinc-950 text-amber-500 text-xs px-2 py-0.5 rounded-full font-black min-w-[20px] text-center">
                            {itemCount || 0}
                        </span>
                    </button>

                    <div className="hidden md:flex items-center gap-2 border-l border-zinc-800 pl-3">
                    {user ? (
                        // Si el usuario ESTÁ logueado, mostramos su mail y el botón Salir
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-400 max-w-[120px] truncate" title={user.email}>
                                {user.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-zinc-800 hover:bg-red-600/20 hover:text-red-400 text-zinc-300 text-xs font-bold px-2.5 py-2 rounded-xl transition-colors cursor-pointer"
                            >
                                Salir
                            </button>
                        </div>
                    ) : (
                        // Si NO hay nadie logueado, mostramos el botón para ir al Login
                        <Link
                            to="/login"
                            className="bg-zinc-900 hover:bg-zinc-800 text-amber-500 border border-zinc-800 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                        >
                            Iniciar Sesión
                        </Link>
                    )}
                </div>


                    {/* Menú Hamburguesa Celular */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-zinc-300 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800"
                        aria-label="Abrir menú"
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            
           {/* Menú desplegable Móvil (Mapeado con soporte para Inicio y Gestión) */}
            {isMenuOpen && (
                <nav className="md:hidden bg-zinc-900 border-b border-zinc-800 px-4 py-4 space-y-3">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={(e) => {
                                if (link.to === '/') {
                                    handleInicioClick(e);
                                } else {
                                    setIsMenuOpen(false);
                                }
                            }}
                            className={navLinkMobileStyles}
                        >
                            {link.label}
                        </NavLink>
                    ))}

                    {/* OPCIÓN DE CUPONES ADENTRO DEL MENÚ MÓVIL */}
                    <button
                        onClick={() => {
                            setIsMenuOpen(false);
                            onOpenCupones();
                        }}
                        className="w-full text-left font-bold text-amber-400 pt-2 border-t border-zinc-800 flex items-center gap-2 cursor-pointer"
                    >
                        <span>🔥</span> Ver Cupones Activos
                    </button>

                    {/* AUTENTICACIÓN MÓVIL */}
                    <div className="pt-3 border-t border-zinc-800">
                        {user ? (
                            <div className="space-y-2">
                                <p className="text-xs text-zinc-400 truncate">Conectado: {user.email}</p>
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="w-full bg-red-500/10 text-red-400 font-bold text-xs py-2 rounded-xl text-center cursor-pointer"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="block w-full bg-amber-500 text-zinc-950 font-bold text-xs py-2 rounded-xl text-center"
                            >
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </nav>
            )}
            

        </header>
    );
}