import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './utils/ScrollToTop';

// Context Providers
import { MenuProvider } from './context/MenuContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { FavoritesProvider } from './context/FavoritesContext';

// Layout 
import Layout from './components/layout/Layout';

// Páginas
import InicioPage from './pages/InicioPage';
import MenuPage from './pages/MenuPage';
import ContactoPage from './pages/ContactoPage';

function App() {
  return (
    <ToastProvider>
      <MenuProvider>
        <CartProvider>
          <FavoritesProvider>
            <ScrollToTop />
            <Routes>
              {/* Layout envuelve la estructura con Navbar, Footer, Outlet y Flotantes */}
              <Route path="/" element={<Layout />}>
                {/* Ruta Principal: Hero + Nosotros */}
                <Route index element={<InicioPage />} />

                {/* Ruta Menú */}
                <Route path="menu" element={<MenuPage />} />

                {/* Ruta Contacto */}
                <Route path="contacto" element={<ContactoPage />} />
              </Route>
            </Routes>
          </FavoritesProvider>
        </CartProvider>
      </MenuProvider>
    </ToastProvider>
  );
}

export default App;