import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { SITE_CONFIG } from '../../config/constants';
import { useMenu } from '../../context/MenuContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';

export default function Navbar() {
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
                    <nav className="hidden md:flex items-center gap-6">
                        {SITE_CONFIG.mainNav.map((link) => (
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
                <div className="flex items-center gap-3">

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

            {/* Menú desplegable Móvil (Mapeado con soporte para Inicio) */}
            {isMenuOpen && (
                <nav className="md:hidden bg-zinc-900 border-b border-zinc-800 px-4 py-4 space-y-3">
                    {SITE_CONFIG.mainNav.map((link) => (
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
                </nav>
            )}
        </header>
    );
}