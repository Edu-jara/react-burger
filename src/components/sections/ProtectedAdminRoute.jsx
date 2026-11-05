import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
    const { user, loading, roleLoading } = useAuth();

    // 1. Si la autenticación o la consulta de rol están en proceso, mostramos un estado de espera neutro
    if (loading || roleLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center text-sm font-medium">
                Verificando permisos de administrador...
            </div>
        );
    }

    // 2. Si no hay usuario autenticado, ahí SÍ redirige al login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Si el usuario existe pero no es admin (una vez que roleLoading es false), redirige a la tienda
    if (user.rol !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // 4. Todo listo: renderiza el panel de control
    return children;
};

export default ProtectedAdminRoute;