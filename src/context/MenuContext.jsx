import { createContext, useContext, useState, useEffect } from 'react';


// 1. Importamos la conexión de Firebase y los métodos de Firestore
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from "firebase/firestore";



const MenuContext = createContext();

export function MenuProvider({ children }) {
    //  LOS  ESTADOS
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [productos, setProductos] = useState([]); // Guardamos la lista plana de productos
    const [categorias, setCategorias] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedCategory, setSelectedCategory] = useState('todas');
    useEffect(() => {
        setCargando(true);
        const productosRef = collection(db, "productos nacionales");

        // Traemos todos los productos sin el where de Firebase
        getDocs(productosRef)
            .then((resp) => {
                const listaProductos = resp.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log("✅ Productos cargados:", listaProductos);
                setProductos(listaProductos);
            })
            .catch((err) => {
                console.error("❌ Error:", err.message);
                setError(err.message);
            })
            .finally(() => {
                setCargando(false);
            });
    }, []);
    
    // FILTRADO POR BÚSQUEDA Y POR CATEGORÍA
    const textoBusqueda = searchQuery.toLowerCase().trim();

    const productosFiltrados = productos.filter((item) => {
        // 1. Filtro por estado activo (si no tiene la propiedad o es true, pasa; si es false, se oculta)
        const estaActivo = item.activo !== false;

        // 2. Filtro por texto en nombre o descripción (usando textoBusqueda)
        const coincideBusqueda =
            (item.nombre || '').toLowerCase().includes(textoBusqueda) ||
            (item.descripcion || '').toLowerCase().includes(textoBusqueda);

        // 3. Filtro por categoría seleccionada
        const coincideCategoria =
            selectedCategory === 'todas' || item.categoria === selectedCategory;

        return estaActivo && coincideBusqueda && coincideCategoria;
    });

    return (
        <MenuContext.Provider value={{
            cargando,
            error,
            searchQuery,
            setSearchQuery,
            productos,            // Lista completa
            productosFiltrados,   // Lista filtrada para mostrar en los componentes
            selectedCategory,
            setSelectedCategory
        }}>
            {children}
        </MenuContext.Provider>
    );
}

export function useMenu() {
    return useContext(MenuContext);
}