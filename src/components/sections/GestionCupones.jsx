import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config.js';

export default function GestionCupon() {
    // Estados para los campos del formulario
    const [codigo, setCodigo] = useState('');
    const [descuento, setDescuento] = useState('');

    // Estado para saber si estamos editando un cupón (guardará su ID)
    const [idCuponEditando, setIdCuponEditando] = useState(null);

    // Estado exclusivo para la lista de cupones de Firebase
    const [cupones, setCupones] = useState([]);

    // Lectura en tiempo real con useEffect y onSnapshot
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "cupones"), (snapshot) => {
            const listaCupones = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setCupones(listaCupones);
        });

        return () => unsubscribe();
    }, []);

    // Función para guardar (Crear o Actualizar)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!codigo || !descuento) {
            alert("Completá todos los campos antes de guardar.");
            return;
        }

        try {
            if (idCuponEditando) {
                // Si hay un ID en edición, actualizamos el documento existente
                const cuponRef = doc(db, "cupones", idCuponEditando);
                await updateDoc(cuponRef, {
                    codigo: codigo,
                    descuento: Number(descuento)
                });
                alert("¡Cupón actualizado con éxito!");
                setIdCuponEditando(null); // Salimos del modo edición
            } else {
                // Si no, creamos uno nuevo
                await addDoc(collection(db, "cupones"), {
                    codigo: codigo,
                    descuento: Number(descuento),
                    creado: new Date()
                });
                alert("¡Cupón creado con éxito!");
            }

            // Limpiamos el formulario
            setCodigo('');
            setDescuento('');
        } catch (error) {
            console.error("Error al guardar el cupón en Firebase:", error);
            alert("Hubo un error al guardar el cupón.");
        }
    };

    // Función para cargar los datos al formulario al hacer click en "Editar"
    const handleEditClick = (cupon) => {
        setIdCuponEditando(cupon.id);
        setCodigo(cupon.codigo);
        setDescuento(cupon.descuento);
    };

    // Función para cancelar la edición si el usuario se arrepiente
    const cancelarEdicion = () => {
        setIdCuponEditando(null);
        setCodigo('');
        setDescuento('');
    };

    // Función para borrar un cupón de Firebase
    const handleEliminar = async (id) => {
        if (window.confirm("¿Estás seguro de que querés borrar este cupón?")) {
            try {
                await deleteDoc(doc(db, "cupones", id));
                // Si borramos el que se estaba editando, limpiamos el form
                if (idCuponEditando === id) {
                    cancelarEdicion();
                }
            } catch (error) {
                console.error("Error al borrar el cupón:", error);
                alert("Hubo un error al eliminar el cupón.");
            }
        }
    };

    //  FUNCIÓN PARA EL SWITCH DE ACTIVAR / PAUSAR
    const handleToggleActivo = async (id, estadoActual) => {
        try {
            const docRef = doc(db, "cupones", id);
            const nuevoEstado = estadoActual === undefined ? false : !estadoActual;
            await updateDoc(docRef, { activo: nuevoEstado });
        } catch (error) {
            console.error("Error al cambiar el estado del cupón:", error);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

            {/* --- COLUMNA 1: Formulario de Carga / Edición --- */}
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-fit">
                <h2 className="text-xl font-bold mb-4 text-amber-500">
                    {idCuponEditando ? "Editar Cupón" : "Crear Nuevo Cupón"}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-zinc-400">Código del Cupón</label>
                        <input
                            type="text"
                            placeholder="Ej: VERANO2026"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value.toUpperCase().trim())}
                            className="bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-zinc-400">Porcentaje de Descuento (%)</label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            placeholder="Ej: 15"
                            value={descuento}
                            onChange={(e) => setDescuento(e.target.value)}
                            className="bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    <div className="flex gap-2 mt-2">
                        <button
                            type="submit"
                            className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold p-3 rounded-lg transition-colors"
                        >
                            {idCuponEditando ? "Actualizar Cupón" : "Guardar Cupón"}
                        </button>

                        {idCuponEditando && (
                            <button
                                type="button"
                                onClick={cancelarEdicion}
                                className="bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-bold p-3 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* --- COLUMNA 2: Listado Dinámico de Firebase --- */}
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <h2 className="text-xl font-bold mb-4 text-amber-500">Cupones Existentes</h2>

                {cupones.length === 0 ? (
                    <p className="text-zinc-500 italic">No hay cupones cargados todavía.</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {cupones.map((cupon) => (
                            <div
                                key={cupon.id}
                                className={`flex flex-col gap-3 p-4 rounded-lg border transition-colors ${cupon.activo === false
                                        ? 'bg-zinc-950/40 border-zinc-500 opacity-40' // Cuando está apagado
                                        : 'bg-zinc-950 border-zinc-800'             // Cuando está prendido
                                    }`}
                            >
                                {/*  Nombre y Descuento */}
                                <div>
                                    <p className="font-bold text-amber-400">{cupon.codigo}</p>
                                    <p className="text-sm text-zinc-400">Descuento: {cupon.descuento}%</p>
                                </div>

                                {/*  Editar y Borrar a la izquierda, Switch a la derecha */}
                                <div className="flex justify-between items-center pt-2 border-t border-zinc-900">

                                    {/* Izquierda  Editar y Borrar */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditClick(cupon)}
                                            className="bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-zinc-950 px-3 py-2 rounded-lg text-sm font-semibold transition-colors h-fit"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => handleEliminar(cupon.id)}
                                            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-zinc-950 px-3 py-2 rounded-lg text-sm font-semibold transition-colors h-fit"
                                        >
                                            Borrar
                                        </button>
                                    </div>

                                    {/* Derecha Botón Switch */}
                                    <button
                                        onClick={() => handleToggleActivo(cupon.id, cupon.activo)}
                                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${cupon.activo !== false ? 'bg-emerald-500' : 'bg-zinc-700'
                                            }`}
                                        title={cupon.activo !== false ? 'Visible en tienda' : 'Pausado'}
                                    >
                                        <div
                                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${cupon.activo !== false ? 'translate-x-6' : 'translate-x-0'
                                                }`}
                                        />
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}