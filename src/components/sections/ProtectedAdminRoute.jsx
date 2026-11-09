import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ProtectedAdminRoute = ({ children }) => {
    const { user, loading, roleLoading } = useAuth();
    
    // Un estado local para forzar que el spinner se muestre un mínimo de tiempo al montar
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVerifying(false);
        }, 800); // 600 milisegundos de respiro visual

        return () => clearTimeout(timer);
    }, []);

    // 1. Si Firebase está cargando, si está buscando el rol en Firestore, O si nuestro temporizador sigue activo:
    if (loading || roleLoading || verifying) {
        return (
            <LoadingSpinner 
                texto="Verificando permisos de administrador..." 
                pantallaCompleta={true} 
            />
        );
    }

    // 2. Si terminó de cargar y NO hay usuario -> Al login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Si hay usuario pero NO es admin -> Afuera
    if (user.rol !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // 4. Todo OK -> Mostramos el panel
    return children;
};

export default ProtectedAdminRoute;