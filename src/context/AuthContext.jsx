import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

import  { auth, db } from '../firebase/config'; 



//  Creamos el Contexto (la "caja" global donde vivirá la información de sesión)
export const AuthContext = createContext();

//  Creamos un Hook personalizado (atajo) para consumir este contexto fácilmente en otros componentes
export const useAuth = () => useContext(AuthContext);

//  Creamos el Proveedor (el componente que envuelve a la app y provee los datos)
export const AuthProvider = ({ children }) => {
    // Estado para guardar la información del usuario actual (uid, email, rol)
    const [user, setUser] = useState(null);
    
    // Estado de carga inicial para evitar que la app parpadee antes de saber si hay sesión activa
    const [loading, setLoading] = useState(true);

    // useEffect que actúa como un "radar" permanente vigilando el estado de autenticación en Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Si Firebase detecta un usuario conectado, buscamos su rol personalizado en Firestore
                const docRef = doc(db, "usuarios", firebaseUser.uid);
                const docSnap = await getDoc(docRef);

                let rol = 'cliente'; // Por seguridad, si no tiene documento, por defecto es 'cliente'
                if (docSnap.exists()) {
                    rol = docSnap.data().rol; // Extraemos el rol ('admin' o 'empleado') desde Firestore
                }

                // Guardamos los datos consolidados en nuestro estado global
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    rol: rol
                });
            } else {
                // Si no hay nadie conectado, limpiamos el estado del usuario
                setUser(null);
            }
            // Una vez que terminó de verificar, apagamos el estado de carga
            setLoading(false);
        });

        // Limpiamos la suscripción al desmontar el componente
        return () => unsubscribe();
    }, []);

    // Función global para iniciar sesión con correo y contraseña
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Función global para cerrar sesión
    const logout = () => {
        return signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {/* Renderizamos los hijos únicamente cuando termina de cargar para evitar errores de renderizado */}
            {!loading && children}
        </AuthContext.Provider>
    );
};