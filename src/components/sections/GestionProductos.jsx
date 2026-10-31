import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase/config.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { subirImagenACloudinary } from '../../services/cloudinaryService';

export default function GestionProductos() {
    const cancelarEdicion = () => {
        setProductoAEditar(null); // Volvemos el estado a null (modo creación)
        setProducto({             // Vaciamos el formulario
            nombre: '',
            precio: '',
            categoria: '',
            descripcion: '',
            imagen: '',
            stock: ''
        });
        setArchivoFoto(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

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

    const [archivoFoto, setArchivoFoto] = useState(null); // Archivo seleccionado de la PC
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(false); // Para mostrar un estado de carga al subir
    const [productoAEditar, setProductoAEditar] = useState(null); // El nuevo estado para editar

    //  Recorremos los productos y sacamos solo las categorías
    const categoriasUnicas = [...new Set(productos.map(prod => prod.categoria))];


    // Guarda el texto que el usuario tipea en la barra de búsqueda
    const [busqueda, setBusqueda] = useState('');

    // Guarda la categoría seleccionada para filtrar ('', 'hamburguesas', 'pizzas', 'empanadas')
    // Arranca vacío ('') para que por defecto muestre "Todas"
    const [categoriaFiltro, setCategoriaFiltro] = useState('');




    const productosFiltrados = productos.filter((prod) => {
        // 1. Revisa si el nombre y la descripcion del producto incluye lo que escribió el usuario (pasamos todo a minúsculas para que no importe si usan mayúsculas)
        const coincideBusqueda =
            prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            (prod.descripcion && prod.descripcion.toLowerCase().includes(busqueda.toLowerCase()));

        // 2. Revisa si la categoría del producto coincide con la categoría seleccionada (o si está vacía, muestra todas)
        const coincideCategoria = categoriaFiltro === '' || prod.categoria === categoriaFiltro;

        // Devuelve true solo si cumple ambas condiciones al mismo tiempo
        return coincideBusqueda && coincideCategoria;
    });


    // Estado para la paginación (arranca en la página 1)
    const [paginaActual, setPaginaActual] = useState(1);
    const productosPorPagina = 6; // Cantidad de tarjetas que se verán por página

    // Cada vez que el usuario busca algo o cambia de categoría, volvemos a la página 1
    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda, categoriaFiltro]);

    //  Calculamos los índices para recortar el array según la página actual
    const indiceUltimoProducto = paginaActual * productosPorPagina;
    const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;

    //  Recortamos la lista para mostrar solo los de la página actual
    const productosPaginados = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);

    //  Calculamos el total de páginas que tendremos en total
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

    // Sincronizar el formulario cuando se selecciona un producto para editar
    useEffect(() => {
        if (productoAEditar) {
            setProducto(productoAEditar);
        } else {
            setProducto({
                nombre: '',
                precio: '',
                categoria: '',
                descripcion: '',
                imagen: '',
                stock: ''
            });
        }
    }, [productoAEditar]);

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
            let urlImagen = producto.imagen; // Si escribió una URL a mano o mantiene la actual

            // ¡Acá está la magia! Reemplazamos todo el bloque de fetch por una sola línea que llama a nuestro servicio
            if (archivoFoto) {
                urlImagen = await subirImagenACloudinary(archivoFoto);
            }

            // Objeto con los datos listos para mandar a Firebase
            const datosParaGuardar = {
                nombre: producto.nombre,
                precio: Number(producto.precio),
                categoria: producto.categoria,
                descripcion: producto.descripcion,
                imagen: urlImagen,
                stock: Number(producto.stock || 0),

                // Si estamos editando mantiene su estado previo, si es nuevo nace activo (true)
                activo: productoAEditar ? (productoAEditar.activo ?? true) : true
            };

            if (productoAEditar) {
                // MODO EDICIÓN: Actualizamos el documento existente usando su ID
                const docRef = doc(db, "productos nacionales", productoAEditar.id);
                await updateDoc(docRef, datosParaGuardar);

                // Salimos del modo edición
                setProductoAEditar(null);
                alert("¡Producto actualizado con éxito!");
            } else {
                // MODO CREACIÓN: Guardamos un documento totalmente nuevo
                await addDoc(collection(db, "productos nacionales"), datosParaGuardar);
                alert("¡Producto guardado con éxito!");
            }
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

        } catch (error) {
            console.error("Error al guardar producto:", error);
            setCargando(false);
            alert("Hubo un error al subir la imagen o guardar el producto.");
        }
    };

    const handleToggleActivo = async (id, estadoActual) => {
        try {
            const docRef = doc(db, "productos nacionales", id);
            // Si por alguna razón el producto viejo no tenía la propiedad, asumimos que era true y lo pasamos a false. Si no, invertimos el valor.
            const nuevoEstado = estadoActual === undefined ? false : !estadoActual;

            await updateDoc(docRef, { activo: nuevoEstado });
        } catch (error) {
            console.error("Error al cambiar el estado del producto:", error);
        }
    };

    const handleEditClick = (producto) => {
        setProductoAEditar(producto); // ¡Acá guardamos el objeto entero!
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
                <h2 className="text-xl font-bold mb-4 text-amber-500">
                    {productoAEditar ? 'Editar Producto' : 'Crear Nuevo Producto'}
                </h2>
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
                        {/* LO NUEVO (Dinámico): */}
                        <select
                            name="categoria"
                            value={producto.categoria}
                            onChange={handleChange}
                            className="bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                            <option value="">Seleccioná una categoría...</option>

                            {/* Recorremos las categorías únicas de Firebase para armar las opciones */}
                            {categoriasUnicas.map((cat) => (
                                <option key={cat} value={cat} className="capitalize">
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
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
                    {/* Vista previa de la imagen actual si estamos editando */}
                    {productoAEditar && producto.imagen && (
                        <div className="flex items-center gap-3 bg-zinc-950 p-2 rounded-lg border border-zinc-800 mt-1">
                            <img
                                src={producto.imagen}
                                alt="Actual"
                                className="w-12 h-12 object-cover rounded-md border border-zinc-700"
                            />
                            <span className="text-xs text-zinc-400">
                                Foto actual en uso. Si no seleccionás otra, se conservará esta.
                            </span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={cargando}
                        className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold p-3 rounded-lg transition-colors mt-2 disabled:opacity-50"
                    >
                        {cargando ? 'Procesando...' : (productoAEditar ? 'Actualizar Producto' : 'Guardar Producto')}
                    </button>
                    {productoAEditar && (
                        <button
                            type="button"
                            onClick={cancelarEdicion}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold p-2.5 rounded-lg transition-colors text-sm"
                        >
                            Cancelar Edición
                        </button>
                    )}
                </form>
            </div>

            {/* --- COLUMNA 2: Lista de Productos Guardados --- */}
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <h2 className="text-xl font-bold mb-4 text-amber-500">Productos Existentes:</h2>

                {/* ------------------------------------------------------------- */}
                {/* BARRA DE BÚSQUEDA Y PESTAÑAS DE FILTRO                         */}
                {/* ------------------------------------------------------------- */}
                <div className="flex flex-col gap-3 mb-4">

                    {/* 1. Input del Buscador */}
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="🔍 Buscar por nombre o ingrediente..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 pr-9 text-zinc-100 text-sm focus:outline-none focus:border-amber-500"
                        />

                        {/* La X solo se muestra si el usuario escribió algo (busqueda != '') */}
                        {busqueda && (
                            <button
                                type="button"
                                onClick={() => setBusqueda('')} // Al hacer clic, vacía el estado
                                className="absolute right-2.5 text-zinc-400 hover:text-amber-500 text-sm font-bold p-1 transition-colors"
                                title="Limpiar búsqueda"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    {/* 2. Botones / Pestañas de Categoría */}
                    <div className="flex flex-wrap gap-2">
                        {/* Botón "Todas": setea el filtro en vacío ('') para mostrar todo */}
                        <button
                            onClick={() => setCategoriaFiltro('')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${categoriaFiltro === ''
                                ? 'bg-amber-500 text-zinc-950' // Si está seleccionado, se pinta de ámbar
                                : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200' // Si no, queda oscuro
                                }`}
                        >
                            Todas
                        </button>

                        {/* Botones generados automáticamente (tienen exactamente tu mismo CSS) */}
                        {categoriasUnicas.map((cat) => (
                            <button
                                key={cat} // Clave obligatoria en React para listas dinámicas
                                onClick={() => setCategoriaFiltro(cat)} // Al hacer clic, filtra por esta categoría
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${categoriaFiltro === cat
                                    ? 'bg-amber-500 text-zinc-950' // Si está activo, se pinta de ámbar
                                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200' // Si no, queda oscuro
                                    }`}
                            >
                                {cat} {/* Muestra el nombre de la categoría */}
                            </button>
                        ))}
                    </div>
                </div>

                {productosFiltrados.length === 0 ? (
                    <p className="text-zinc-500 italic">No se encontraron productos con esos filtros.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {/* 1. Lista recortada con los productos de la página actual */}
                        <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2">
                            {productosPaginados.map((prod) => (
                                <div
                                    key={prod.id}
                                    className={`flex flex-col gap-4 p-4 rounded-lg border transition-all duration-300 ${prod.activo !== false
                                        ? 'bg-zinc-950 border-zinc-800 opacity-100' // Activo: Normal y brillante
                                        : 'bg-zinc-950/30 border-zinc-500 opacity-30' // Inactivo: Atenuado y opaco
                                        }`}
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

                                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                                        {/* Izquierda: Editar y Borrar agrupados */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditClick(prod)}
                                                className="bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-zinc-950 px-3 py-2 rounded-lg text-sm font-semibold transition-colors h-fit"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(prod.id)}
                                                className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-zinc-950 px-3 py-2 rounded-lg text-sm font-semibold transition-colors h-fit"
                                            >
                                                Borrar
                                            </button>
                                        </div>

                                        {/* Derecha: El Switch solito a la punta */}
                                        <button
                                            onClick={() => handleToggleActivo(prod.id, prod.activo)}
                                            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${prod.activo !== false ? 'bg-emerald-500' : 'bg-zinc-700'
                                                }`}
                                            title={prod.activo !== false ? 'Visible en tienda' : 'Pausado'}
                                        >
                                            <div
                                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${prod.activo !== false ? 'translate-x-6' : 'translate-x-0'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 2. Controles de Paginación (Se muestran solo si hay más de 1 página) */}
                        {totalPaginas > 1 && (
                            <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs text-zinc-400">
                                <button
                                    onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                                    disabled={paginaActual === 1}
                                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-semibold"
                                >
                                    ← Anterior
                                </button>

                                <span>
                                    Página <strong className="text-amber-400">{paginaActual}</strong> de <strong className="text-zinc-200">{totalPaginas}</strong>
                                </span>

                                <button
                                    onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                                    disabled={paginaActual === totalPaginas}
                                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-semibold"
                                >
                                    Siguiente →
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}