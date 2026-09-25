import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    // Inicialización perezosa: lee localStorage solo una vez al montar
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem('burgerhub_favorites');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Error al cargar favoritos desde localStorage:", error);
            return [];
        }
    });

    // Sincronización automática con localStorage en cada cambio
    useEffect(() => {
        try {
            localStorage.setItem('burgerhub_favorites', JSON.stringify(favorites));
        } catch (error) {
            console.error("Error al guardar favoritos en localStorage:", error);
        }
    }, [favorites]);

    // Función para agregar o eliminar un producto por su ID
    const toggleFavorite = useCallback((productId) => {
        setFavorites((prev) => {
            if (prev.includes(productId)) {
                return prev.filter((id) => id !== productId); // Lo quita
            }
            return [...prev, productId]; // Lo agrega
        });
    }, []);

    // Consulta rápida para saber si un ID es favorito
    const isFavorite = useCallback((productId) => {
        return favorites.includes(productId);
    }, [favorites]);

    // Valor memoizado del contexto para prevenir re-renders innecesarios
    const value = useMemo(() => ({
        favorites,
        toggleFavorite,
        isFavorite,
        favoritesCount: favorites.length
    }), [favorites, toggleFavorite, isFavorite]);

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}

// Hook personalizado para consumir el contexto de forma segura
export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites debe ser usado dentro de un FavoritesProvider');
    }
    return context;
}