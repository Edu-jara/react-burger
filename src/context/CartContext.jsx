import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    //  Inicialización perezosa (Solo lee localStorage al montar)
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('react_burger_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Error al cargar el carrito desde localStorage:", error);
            return [];
        }
    });

    // Control de visibilidad del panel lateral del carrito
    const [isCartOpen, setIsCartOpen] = useState(false);

    //  Sincronización automática con localStorage
    useEffect(() => {
        try {
            localStorage.setItem('react_burger_cart', JSON.stringify(cart));
        } catch (error) {
            console.error("Error al guardar el carrito en localStorage:", error);
        }
    }, [cart]);

    //  Sincronización multi-pestaña
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'react_burger_cart' && e.newValue) {
                try {
                    setCart(JSON.parse(e.newValue));
                } catch (error) {
                    console.error("Error al parsear el carrito desde otra pestaña:", error);
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    //  Métodos para manipular el carrito
    const addToCart = useCallback((product) => {
        setCart(prevCart => {
            const existingIndex = prevCart.findIndex(item => item.id === product.id);
            if (existingIndex >= 0) {
                const updatedCart = [...prevCart];
                updatedCart[existingIndex] = {
                    ...updatedCart[existingIndex],
                    quantity: updatedCart[existingIndex].quantity + 1
                };
                return updatedCart;
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id, delta) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === id) {
                    const newQuantity = item.quantity + delta;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                }
                return item;
            }).filter(Boolean);
        });
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const getItemQuantity = useCallback((id) => {
        const item = cart.find(i => i.id === id);
        return item ? item.quantity : 0;
    }, [cart]);

    // 5. Cálculos derivados con Memoización
    const itemCount = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);
    
    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => {
            const precioNum = Number(item.precio) || 0;
            return total + (precioNum * item.quantity);
        }, 0);
    }, [cart]);

    //  Integración para enviar pedido a WhatsApp
    const sendOrderToWhatsApp = useCallback((customerData) => {
        const phoneNumber = "5492215340285"; // Reemplazar por el WhatsApp real del local

        let message = `🍔 *¡NUEVO PEDIDO - LA BURGERIA!* 🍔%0A`;
        message += `------------------------------------%0A`;
        message += `👤 *Cliente:* ${customerData.nombre}%0A`;
        message += `📍 *Dirección:* ${customerData.direccion}%0A`;
        message += `💳 *Pago:* ${customerData.metodoPago}%0A`;
        if (customerData.notas) {
            message += `📝 *Notas:* ${customerData.notas}%0A`;
        }
        message += `------------------------------------%0A`;
        message += `🛒 *DETALLE:*%0A`;

        cart.forEach((item) => {
            const precioNum = Number(item.precio) || 0;
            const subtotal = precioNum * item.quantity;
            message += `• ${item.quantity}x ${item.nombre} ($${subtotal.toLocaleString('es-AR')})%0A`;
        });

        message += `------------------------------------%0A`;
        message += `💰 *TOTAL:* $${cartTotal.toLocaleString('es-AR')}%0A`;
        message += `------------------------------------`;

        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }, [cart, cartTotal]);

    //  Memoización del valor del contexto
    const value = useMemo(() => ({
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        itemCount,
        cartTotal,
        sendOrderToWhatsApp
    }), [
        cart, 
        isCartOpen, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        getItemQuantity, 
        itemCount, 
        cartTotal, 
        sendOrderToWhatsApp
    ]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
}