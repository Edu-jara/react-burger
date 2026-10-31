// Importamos los hooks necesarios de React: useState para manejar estados y useEffect para efectos secundarios
import React, { useState, useEffect } from 'react';

// Importamos las herramientas de Firebase Firestore para consultar la base de datos en tiempo real
import { collection, onSnapshot } from 'firebase/firestore';

// Importamos la configuración de nuestra base de datos 
import { db } from '../../firebase/config.js';

// Exportamos por defecto nuestro componente ModalCupones que recibe dos propiedades (props) desde el padre
export default function ModalCupones({ isOpen, onClose }) {

    // ESTADO 1: Guarda la lista de cupones que vienen de Firebase (arranca como un array vacío [])
    const [cuponesDisponibles, setCuponesDisponibles] = useState([]);

    // ESTADO 2: Guarda la ID del cupón que el usuario acaba de copiar (para cambiar el botón temporalmente)
    const [copiadoId, setCopiadoId] = useState(null);

    // EFECTO EN TIEMPO REAL: Se conecta a Firebase cada vez que la prop 'isOpen' cambia
    useEffect(() => {
        // Si el modal está cerrado (!isOpen), no hacemos nada para ahorrar recursos y datos
        if (!isOpen) return;

        // onSnapshot escucha en vivo la colección "cupones" de Firebase (cualquier cambio se detecta al instante)
        const unsubscribe = onSnapshot(collection(db, "cupones"), (snapshot) => {

            // Transformamos los documentos crudos de Firebase en un array de objetos con su ID y datos
            const lista = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            // Filtramos la lista: dejamos pasar únicamente los cupones que NO estén apagados (activo !== false)
           // const activos = lista.filter(c => c.activo !== false);

            console.log("📦 Datos recibidos de Firebase:", lista);

        const activos = lista.filter(c => c.activo !== false);
        console.log("✅ Cupones filtrados (activos):", activos);

            // Guardamos los cupones activos en nuestro estado
            setCuponesDisponibles(activos);
        });

        // Función de limpieza (cleanup): se ejecuta cuando el modal se cierra para apagar el escuchador de Firebase
        return () => unsubscribe();
    }, [isOpen]); // Este efecto se vuelve a activar solo si 'isOpen' cambia

    // FUNCIÓN DE COPIADO: Copia el código al portapapeles del dispositivo y activa el feedback visual
    const handleCopiar = (codigo, id) => {
        // API nativa del navegador para copiar texto automáticamente al portapapeles
        navigator.clipboard.writeText(codigo);

        // Guardamos el ID del cupón que se copió
        setCopiadoId(id);

        // Temporizador (setTimeout): a los 2 segundos borramos el ID para que el botón vuelva a la normalidad
        setTimeout(() => {
            setCopiadoId(null);
        }, 2000);
    };

    // CONDICIÓN DE RENDERIZADO: Si el modal está cerrado, no dibujamos absolutamente nada en el DOM
    if (!isOpen) return null;

    return (
        // Contenedor principal: cubre toda la pantalla (fixed inset-0) y se pone arriba de todo (z-50)
        <div className="fixed inset-0 z-50 flex justify-end">

            {/* 1. EL FONDO OSCURO (Backdrop): Oscurece la web y si el usuario hace clic afuera, ejecuta onClose() */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* 2. EL PANEL DESLIZANTE: La caja principal que aparece desde la derecha con animación y sombra */}
            <div className="relative z-10 w-full max-w-md bg-zinc-900 border-l border-zinc-800 h-full p-6 flex flex-col shadow-2xl">

                {/* CABECERA DEL MODAL: Título y botón de cierre ("X") */}
                <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-4">
                    <h2 className="text-xl font-bold text-amber-500">🔥 Cupones Disponibles</h2>

                    {/* Botón para cerrar el modal manualmente */}
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-100 text-xl font-bold px-2 py-1 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* CUERPO DEL MODAL (Con Scroll vertical automático si hay muchos cupones) */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">

                    {/* Operador Ternario: Si no hay cupones, muestra aviso. Si hay, los mapea uno por uno */}
                    {cuponesDisponibles.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-zinc-400 text-sm">No hay cupones activos en este momento.</p>
                            <p className="text-zinc-600 text-xs mt-1">¡Volvé más tarde por nuevas promos!</p>
                        </div>
                    ) : (
                        // Recorremos cada cupón activo para armar su tarjeta visual
                        cuponesDisponibles.map((cupon) => (
                            <div
                                key={cupon.id} //  key única por cada elemento de la lista
                                className="bg-zinc-950 border border-dashed border-amber-500/40 p-4 rounded-xl flex justify-between items-center gap-3"
                            >
                                {/* Información del cupón (Descuento y Código) */}
                                <div>
                                    <span className="text-xs bg-amber-500/10 text-amber-400 font-semibold px-2 py-0.5 rounded border border-amber-500/20">
                                        {cupon.descuento}% OFF
                                    </span>
                                    <p className="text-amber-400 font-bold tracking-wider text-lg mt-1">
                                        {cupon.codigo}
                                    </p>
                                </div>

                                {/* Botón de Copiar con cambio de color y texto dinámico si fue presionado */}
                                <button
                                    onClick={() => handleCopiar(cupon.codigo, cupon.id)}
                                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all h-fit ${copiadoId === cupon.id
                                        ? 'bg-emerald-500 text-zinc-950' // Color verde y texto negro si fue copiado
                                        : 'bg-amber-500 hover:bg-amber-400 text-zinc-950' // Color dorado normal
                                        }`}
                                >
                                    {copiadoId === cupon.id ? '¡Copiado!' : 'Copiar'}
                                </button>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}