import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { SITE_CONFIG } from '../../config/constants';


const Login = () => {
    // Estados locales para capturar lo que el usuario escribe en los inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Traemos la función login desde nuestro contexto global
    const { login } = useAuth();

    // Hook de React Router para redirigir al usuario después de loguearse
    const navigate = useNavigate();

   const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError('');       
        setLoading(true);

        try {
            // 1. Ejecutamos el login de Firebase y esperamos su respuesta total
            await login(email, password);
            console.log("¡Autenticación de Firebase exitosa!");
            
            // 2. En lugar de forzar un navigate inmediato que choca contra la sincronía,
            // simplemente dejamos que el componente reaccione o redirigimos de forma segura.
            // Si tu App o tu Navbar reaccionan al cambio de "user", el cambio de ruta 
            // debería dispararse solo. Pero si usás navigate, lo forzamos con un reemplazo limpio:
            navigate('/control', { replace: true });

        } catch (err) {
            console.error("Error al iniciar sesión:", err.message);
            // Mensajes más claros según el error de Firebase
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError('Correo o contraseña incorrectos.');
            } else {
                setError('Ocurrió un error al iniciar sesión. Intentá de nuevo.');
            }
            setLoading(false); // Solo liberamos el loading si hay error para que no parpadee
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center px-4 selection:bg-amber-500 selection:text-zinc-950">

            {/* Tarjeta principal del Login */}
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl space-y-6">

                {/* Cabecera / Logo */}
                <div className="text-center space-y-2">
                    <Link to="/" className="text-2xl font-black text-amber-500 tracking-wider">
                        {SITE_CONFIG?.nombre ? SITE_CONFIG.nombre.toUpperCase() : 'MI TIENDA'}
                    </Link>
                    <h1 className="text-lg font-bold text-zinc-200">Acceso Administrativo</h1>
                    <p className="text-xs text-zinc-400">Ingresá tus credenciales para administrar el negocio</p>
                </div>

                {/* Si ocurre un error en el login, lo mostramos en pantalla */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold p-3 rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-300">Correo Electrónico:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@tu negocio.com"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
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
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 hover:text-amber-500 transition-colors px-2 py-1 cursor-pointer"
                            >
                                {showPassword ? "Ocultar" : "Ver"}
                            </button>
                        </div>
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Verificando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                {/* Enlace para volver al inicio */}
                <div className="text-center pt-2 border-t border-zinc-800">
                    <Link to="/" className="text-xs text-zinc-400 hover:text-amber-500 transition-colors">
                        ← Volver al inicio de la tienda
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Login;