import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config.js'; // Ajustá la ruta según dónde tengas tu archivo de config de Firebase

export default function GestionCupon() {
    //  Estados para capturar los datos que tipea el usuario
    const [codigo, setCodigo] = useState('');
    const [descuento, setDescuento] = useState('');

    //  Estado para guardar la lista de cupones traída de Firebase
    const [cupones, setCupones] = useState([]);

    //  Lectura en tiempo real con useEffect y onSnapshot
    useEffect(() => {
        // Escuchamos la colección "cupones"
        const unsubscribe = onSnapshot(collection(db, "cupones"), (snapshot) => {
            const listaCupones = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setCupones(listaCupones);
        });

        // Limpiamos la suscripción cuando el componente se desmonta
        return () => unsubscribe();
    }, []);

    //  Función para guardar un nuevo cupón en Firebase
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que se recargue la página

        // Validamos que los campos no estén vacíos
        if (!codigo || !descuento) {
            alert("Completá todos los campos antes de guardar.");
            return;
        }

        try {
            await addDoc(collection(db, "cupones"), {
                codigo: codigo,
                descuento: Number(descuento),
                creado: new Date()
            });

            // Limpiamos los campos del formulario tras guardar con éxito
            setCodigo('');
            setDescuento('');
        } catch (error) {
            console.error("Error al guardar el cupón en Firebase:", error);
            alert("Hubo un error al guardar el cupón.");
        }
    };

    //  Función para borrar un cupón de Firebase
    const handleEliminar = async (id) => {
        if (window.confirm("¿Estás seguro de que querés borrar este cupón?")) {
            try {
                await deleteDoc(doc(db, "cupones", id));
            } catch (error) {
                console.error("Error al borrar el cupón:", error);
                alert("Hubo un error al eliminar el cupón.");
            }
        }
    };

    return (
        // Contenedor principal: 1 columna en celulares, 2 columnas en PC (grid md:grid-cols-2)
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

            {/* --- COLUMNA 1: Formulario de Carga --- */}
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-fit">
                <h2 className="text-xl font-bold mb-4 text-amber-500">Crear Nuevo Cupón</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Campo Código */}
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

                    {/* Campo Porcentaje */}
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

                    {/* Botón Guardar */}
                    <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold p-3 rounded-lg transition-colors mt-2"
                    >
                        Guardar Cupón
                    </button>
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
                                className="flex justify-between items-center bg-zinc-950 p-4 rounded-lg border border-zinc-800"
                            >
                                <div>
                                    <p className="font-bold text-amber-400">{cupon.codigo}</p>
                                    <p className="text-sm text-zinc-400">Descuento: {cupon.descuento}%</p>
                                </div>

                                <button
                                    onClick={() => handleEliminar(cupon.id)}
                                    className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-zinc-950 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    Borrar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}