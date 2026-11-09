import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { SITE_CONFIG } from '../../config/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner'; // 1. Importamos el spinner

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    // Estado local exclusivo para congelar la pantalla con el spinner al hacer submit
    const [isLoggingIn, setIsLoggingIn] = useState(false); 

    const { login } = useAuth();
    const navigate = useNavigate();

 const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading || isLoggingIn) return;

        setError('');
        setLoading(true);
        setIsLoggingIn(true); // Forzamos el estado visual al instante

        try {
            // Disparamos el login pero no bloqueamos la pintura visual
            await login(email, password);
            console.log("¡Login exitoso!");

            // Dejamos un respiro generoso de 1000ms para obligar a ver la animación
            setTimeout(() => {
                navigate('/control', { replace: true });
            }, 800);

        } catch (err) {
            console.error("Error al iniciar sesión:", err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError('Correo o contraseña incorrectos.');
            } else {
                setError('Ocurrió un error al iniciar sesión. Intentá de nuevo.');
            }
            setLoading(false);
            setIsLoggingIn(false); // Apagamos si hay error
        }
    };

    // Interceptamos la vista: si isLoggingIn es true, mostramos el LoadingSpinner en toda la pantalla
    if (isLoggingIn) {
        return (
            <LoadingSpinner 
                texto="Iniciando sesión y verificando permisos..." 
                pantallaCompleta={true} 
            />
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center px-4">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl space-y-6">
                <div className="text-center space-y-2">
                    <Link to="/" className="text-2xl font-black text-amber-500 tracking-wider">
                        {SITE_CONFIG?.nombre ? SITE_CONFIG.nombre.toUpperCase() : 'MI TIENDA'}
                    </Link>
                    <h1 className="text-lg font-bold text-zinc-200">Acceso Administrativo</h1>
                    <p className="text-xs text-zinc-400">Ingresá tus credenciales para administrar el negocio</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold p-3 rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Campos de email y contraseña igual que siempre */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-300">Correo Electrónico:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@tunegocio.com"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-300">Contraseña:</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                            />
                            {/* Botón de ver/ocultar contraseña (tus SVGs habituales) */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 focus:outline-none cursor-pointer p-1"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Entrando al panel...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="text-center pt-2 border-t border-zinc-800">
                    <Link to="/" className="text-xs text-zinc-400 hover:text-amber-500">
                        ← Volver al inicio de la tienda
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;