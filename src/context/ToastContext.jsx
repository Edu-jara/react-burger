import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, icon = '🛒') => { // Acepta icon, default '🛒'
        const id = Date.now();
        // Guardamos message E icon en el nuevo objeto de toast
        setToasts(prev => [...prev, { id, message, icon }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {/* Notificaciones flotantes: Arriba en móvil (top-20), abajo a la derecha en desktop (md:top-auto md:bottom-5 md:right-5) */}
            <div className="fixed top-20 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:top-auto md:bottom-5 md:right-5 z-50 flex flex-col gap-2 pointer-events-none w-[90%] max-w-sm md:w-auto">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="bg-zinc-900 border border-amber-500/40 text-amber-400 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 pointer-events-auto"
                        >
                            <span>{toast.icon}</span>
                            <span>{toast.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);