import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase/config.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function GestionProductos() {
    const fileInputRef = useRef(null);
    //  Estado en forma de objeto con la estructura exacta de Firebase
    const [producto, setProducto] = useState({
        nombre: '',
        precio: '',
        categoria: '',
        descripcion: '',
        imagen: '',
        stock: ''
    });
    
    const [archivoFoto, setArchivoFoto] = useState(null);// Archivo seleccionado de la PC
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(false);// Para mostrar un estado de carga al subir

    //  Lectura en tiempo real de Firebase
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "productos nacionales"), (snapshot) => {
            const listaProductos = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setProductos(listaProductos);
        });
        return () => unsubscribe();
    }, []);

    //  Manejador inteligente para actualizar el objeto completo
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto({
            ...producto,
            [name]: value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!producto.nombre || !producto.precio || !producto.categoria) {
            alert("Completá al menos el nombre, precio y categoría.");
            return;
        }

        try {
            setCargando(true);
            let urlImagen = producto.imagen; // Si escribió una URL a mano

            // seleccionó un archivo de su PC, lo subimos a Cloudinary 
            if (archivoFoto) {
                const data = new FormData();
                data.append("file", archivoFoto);
                data.append("upload_preset", "preset_react"); // Usamos el preset público de Cloudinary
                data.append("cloud_name", "uwfa2bue");     // mi Cloud Name 

                const respuesta = await fetch("https://api.cloudinary.com/v1_1/uwfa2bue/image/upload", {
                    method: "POST",
                    body: data
                });

                const archivoSubido = await respuesta.json();

                if (archivoSubido.secure_url) {
                    urlImagen = archivoSubido.secure_url; // ¡Acá tenemos el link listo para la base de datos!
                } else {
                    throw new Error("No se pudo subir la imagen a Cloudinary");
                }
            }

            // Guardamos todo en Firestore (en la colección "productos nacionales")
            await addDoc(collection(db, "productos nacionales"), {
                nombre: producto.nombre,
                precio: Number(producto.precio),
                categoria: producto.categoria,
                descripcion: producto.descripcion,
                imagen: urlImagen,
                stock: Number(producto.stock || 0)
            });

            // Reseteamos el formulario
            setProducto({
                nombre: '',
                precio: '',
                categoria: '',
                descripcion: '',
                imagen: '',
                stock: ''
            });
            setArchivoFoto(null);
            // limpiar el input de las imágenes (el de tipo file).
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setCargando(false);
            alert("¡Producto guardado y foto subida con éxito!");
        } catch (error) {
            console.error("Error al guardar producto:", error);
            setCargando(false);
            alert("Hubo un error al subir la imagen o guardar el producto.");
        }
    };

    //  Borrar de Firebase
    const handleEliminar = async (id) => {
        if (window.confirm("¿Seguro querés borrar este producto?")) {
            try {
                await deleteDoc(doc(db, "productos nacionales", id));
            } catch (error) {
                console.error("Error al borrar:", error);
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

            {/* --- COLUMNA 1: Formulario con todos los campos --- */}
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-fit">
                <h2 className="text-xl font-bold mb-4 text-amber-500">Crear Nuevo Producto</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Nombre */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-zinc-400">Nombre del Producto</label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Ej: Empanada de Pollo"
                            value={producto.nombre}
                            onChange={handleChange}
                            className="bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    {/* Precio y Stock (en una fila de dos columnas para ahorrar espacio) */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-zinc-400">Precio ($)</label>
                            <input
                                type="number"
                                name="precio"
                                placeholder="Ej: 900"
                                value={producto.precio}
                                onChange={handleChange}
                                className="bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-amber-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-zinc-400">Stock (Cantidad)</label>
                            <input
                                type="number"
                                name="stock"
                                placeholder="Ej: 30"
                                value={producto.stock}
                                onChange={handleChange}
                                className="bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-amber-500"
                            />
                        </div>
                    </div>


                    {/* Categoría (Selector fijo para evitar errores) */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-zinc-400">Categoría</label>
                        <select
                            name="categoria"
                            value={producto.categoria}
                            onChange={handleChange}
                            className="bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                            <option value="">Seleccioná una categoría...</option>
                            <option value="hamburguesas">Hamburguesas</option>
                            <option value="pizzas">Pizzas</option>
                            <option value="empanadas">Empanadas</option>
                        </select>
                    </div>
                    {/* Descripción */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-zinc-400">Descripción</label>
                        <textarea
                            name="descripcion"
                            placeholder="Ej: Pollo desmenuzado salteado..."
                            value={producto.descripcion}
                            onChange={handleChange}
                            rows="2"
                            className="bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
                        />
                    </div>

                    {/* Imagen (Archivo de la PC para subir a Cloudinary) */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-zinc-400">Foto del Producto (Seleccionar de la PC)</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={(e) => setArchivoFoto(e.target.files[0])}
                            className="bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-zinc-400 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-zinc-950 hover:file:bg-amber-400 cursor-pointer"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={cargando}
                        className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold p-3 rounded-lg transition-colors mt-2 disabled:opacity-50"
                    >
                        {cargando ? 'Subiendo imagen y guardando...' : 'Guardar Producto'}
                    </button>
                </form>
            </div>

            {/* --- COLUMNA 2: Lista de Productos Guardados --- */}
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <h2 className="text-xl font-bold mb-4 text-amber-500">Productos Existentes</h2>

                {productos.length === 0 ? (
                    <p className="text-zinc-500 italic">No hay productos cargados todavía.</p>
                ) : (
                    <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2">
                        {productos.map((prod) => (
                            <div
                                key={prod.id}
                                className="flex justify-between items-center bg-zinc-950 p-4 rounded-lg border border-zinc-800"
                            >
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-amber-400">{prod.nombre}</span>
                                        <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">
                                            {prod.categoria}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-400 line-clamp-1">{prod.descripcion}</p>
                                    <div className="flex gap-4 text-sm mt-1">
                                        <span className="text-zinc-200 font-semibold">${prod.precio}</span>
                                        <span className="text-zinc-400">Stock: {prod.stock}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleEliminar(prod.id)}
                                    className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-zinc-950 px-3 py-2 rounded-lg text-sm font-semibold transition-colors h-fit"
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