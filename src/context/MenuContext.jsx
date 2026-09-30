import { createContext, useContext, useState, useEffect } from 'react';

const MenuContext = createContext();

export function MenuProvider({ children }) {
    //  LOS  ESTADOS
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedCategory, setSelectedCategory] = useState('todas');

    //  PETICIÓN AL MONTAR
    useEffect(() => {
        fetch('/data/menuData.json')
            .then((res) => {
                // Si la respuesta no es OK (ej. 404), lanzamos un error claro
                if (!res.ok) {
                    throw new Error(`Error HTTP ${res.status}: No se encontró el archivo /data/menuData.json`);
                }

                // Verificamos que el servidor devuelva contenido tipo JSON y no HTML
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("El archivo devuelto no es un JSON válido (probablemente devolvió un HTML 404). Checkea que esté en public/data/menuData.json");
                }

                return res.json();
            })
            .then((datos) => {
                console.log("✅ JSON cargado exitosamente:", datos);
                setCategorias(datos);
            })
            .catch((err) => {
                console.error("❌ Falló la carga del menú:", err.message);
                setError(err.message);
            })
            .finally(() => {
                setCargando(false);
            });
    }, []);

    //  FILTRADO SEGURO CON OPTIONAL CHAINING (?.)
    const query = searchQuery.toLowerCase().trim();

    const categoriasFiltradas = (categorias || []).map(categoria => {
        const productosFiltrados = (categoria.datos || []).filter(item => {
            // Evaluamos con ?. y fallback a string vacío '' para evitar undefined
            const nombre = (item.nombre || '').toLowerCase();
            const descripcion = (item.descripcion || '').toLowerCase();

            return nombre.includes(query) || descripcion.includes(query);
        });

        return {
            ...categoria,
            datos: productosFiltrados
        };
    }).filter(categoria => categoria.datos && categoria.datos.length > 0);

    return (
        <MenuContext.Provider value={{
            cargando,
            error,
            searchQuery,
            setSearchQuery,
            categorias,
            categoriasFiltradas,
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