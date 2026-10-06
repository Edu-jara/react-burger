import { createContext, useContext, useState, useEffect } from 'react';


// 1. Importamos la conexión de Firebase y los métodos de Firestore
import { db } from '../firebase/config'; 
import { collection, getDocs } from 'firebase/firestore';




const MenuContext = createContext();

export function MenuProvider({ children }) {
    //  LOS  ESTADOS
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [productos, setProductos] = useState([]); // Guardamos la lista plana de productos
    const [categorias, setCategorias] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedCategory, setSelectedCategory] = useState('todas');

    //  PETICIÓN AL MONTAR
    useEffect(() => {
        setCargando(true);

        // Referencia a la colección en Firestore
        const productosRef = collection(db, "productos nacionales");

        getDocs(productosRef)
            .then((resp) => {
                // Mapeamos los documentos de Firestore agregando el id
                const listaProductos = resp.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                console.log("✅ Productos cargados desde Firestore:", listaProductos);
                setProductos(listaProductos);
            })
            .catch((err) => {
                console.error("❌ Falló la carga desde Firestore:", err.message);
                setError(err.message);
            })
            .finally(() => {
                setCargando(false);
            });
    }, []);
    // FILTRADO POR BÚSQUEDA Y POR CATEGORÍA
    const query = searchQuery.toLowerCase().trim();

    const productosFiltrados = productos.filter((item) => {
        // 1. Filtro por texto en nombre o descripción
        const coincideBusqueda = 
            (item.nombre || '').toLowerCase().includes(query) ||
            (item.descripcion || '').toLowerCase().includes(query);

        // 2. Filtro por categoría seleccionada
        const coincideCategoria = 
            selectedCategory === 'todas' || item.categoria === selectedCategory;

        return coincideBusqueda && coincideCategoria;
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