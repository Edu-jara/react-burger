import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// Ajustá las rutas según dónde tengas los flotantes en tu proyecto:
import CartDrawer from '../ui/CartDrawer';
import BotonWhatsApp from '../ui/Botonwhatsapp';

export default function Layout() {
    return (
        <div className="bg-zinc-950 min-h-screen text-zinc-100 selection:bg-amber-500 selection:text-zinc-950 flex flex-col justify-between">
            {/* Header / Navegación fija */}
            <Navbar />

            {/* Contenido dinámico (donde React Router inyecta InicioPage, MenuPage, etc.) */}
            <main className="flex-1 pt-16">
                <Outlet />
            </main>

            {/* Pie de página */}
            <Footer />

            {/* Overlays y Widgets flotantes */}
            <BotonWhatsApp />
            <CartDrawer />
        </div>
    );
}