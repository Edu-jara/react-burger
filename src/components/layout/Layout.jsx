import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

import CartDrawer from '../ui/CartDrawer';
import BotonWhatsApp from '../ui/Botonwhatsapp';
import BarraFinalizarCompra from '../ui/BarraFinalizarCompra';

import { useCart } from '../../context/CartContext'; 

export default function Layout() {
    // Consumimos todo directamente del Context
    const { 
        cart, 
        itemCount, 
        cartTotal, 
        setIsCartOpen 
    } = useCart();

    const abrirModalCarrito = () => setIsCartOpen(true);

    return (
        <div className="bg-zinc-950 min-h-screen text-zinc-100 selection:bg-amber-500 selection:text-zinc-950 flex flex-col justify-between">
            {/* Header / Navegación */}
            <Navbar />

            {/* Contenido dinámico */}
            <main className="flex-1 pt-16">
                <Outlet />
            </main>

            {/* Pie de página */}
            <Footer />

            {/* Overlays y Widgets Flotantes */}
            <BarraFinalizarCompra
                carrito={cart}
                totalPrecio={cartTotal}
                abrirModalCarrito={abrirModalCarrito}
            />

            <BotonWhatsApp 
                flotante={true}
                cantidadTotal={itemCount} 
            />

            <CartDrawer />
        </div>
    );
}