import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';


// Función para determinar la ruta correcta de la imagen
const obtenerImagenURL = (foto) => {
    // Si no hay foto guardada, usamos un avatar por defecto
    if (!foto) return 'https://i.pravatar.cc/300?img=11';

    // Si es un link público de internet, lo usamos tal cual
    if (foto.startsWith('http://') || foto.startsWith('https://')) {
        return foto;
    }

     
    // le agregamos la ruta hacia la carpeta src/assets/
    return new URL(`../../assets/${foto}`, import.meta.url).href;
};


export const EquipoDrawer = ({ isOpen, onClose }) => {
    // Estado para guardar la lista de integrantes
    const [equipo, setEquipo] = useState([]);
    // Estado para saber si la consulta está en curso
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Si el drawer está cerrado, no hacemos la consulta a Firestore
        if (!isOpen) return;

        const obtenerEquipo = async () => {
            try {
                setLoading(true);
                // Hacemos la consulta a la colección 'equipo'
                const querySnapshot = await getDocs(collection(db, 'equipo'));

                // Transformamos los documentos en un array de objetos
                const docs = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setEquipo(docs);
            } catch (error) {
                console.error('Error al obtener la colección equipo:', error);
            } finally {
                setLoading(false);
            }
        };

        obtenerEquipo();
    }, [isOpen]); // Se ejecuta cada vez que 'isOpen' cambia



    // Si el Drawer está cerrado, no renderizamos nada en el DOM
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Fondo oscuro al hacer clic afuera se cierra */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            />

            {/* Panel lateral deslizante */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-zinc-900 border-l border-zinc-800 p-6 text-white flex flex-col justify-between shadow-2xl">

                    <div>
                        {/* Cabecera */}
                        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                            <h3 className="text-lg font-bold text-amber-400">Créditos del Proyecto</h3>
                            <button
                                onClick={onClose}
                                className="text-zinc-400 hover:text-white transition-colors text-xl p-1"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="text-zinc-400 text-xs mt-3 mb-6">
                            Desarrolladores a cargo del proyecto BurgerHub.
                        </p>

                        {/* Renderizado condicional y mapeo de datos de Firestore */}
                        {loading ? (
                            <div className="text-center py-12 text-amber-400 text-sm">
                                Cargando equipo...
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {equipo.map((dev) => (
                                    <div
                                        key={dev.id}
                                        className="flex items-center gap-4 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-amber-500/50 transition-all group"
                                    >
                                        <img
                                            src={obtenerImagenURL(dev.fotoURL)}
                                            alt={dev.nombre}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shrink-0 group-hover:scale-105 transition-transform"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-white text-base truncate">
                                                {dev.nombre}
                                            </h4>
                                            <p className="text-amber-400 text-xs mb-2">
                                                {dev.rol || 'Desarrollador'}
                                            </p>
                                            {dev.linkedinURL && (
                                                <a
                                                    href={dev.linkedinURL}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-amber-400 transition-colors underline decoration-amber-500/40"
                                                >
                                                    <span>Perfil profesional</span> ↗
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pie del Drawer */}
                    <div className="pt-4 border-t border-zinc-800 text-center">
                        <p className="text-xs text-zinc-500">
                            BurgerHub · React & Firebase
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};