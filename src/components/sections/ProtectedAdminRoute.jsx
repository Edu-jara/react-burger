import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Verificando credenciales...</div>;
    }

    if (!user || user.rol !== 'admin') {
        // Si no está logueado o no es admin, redirige al login
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;