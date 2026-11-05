import React, { createContext, useState, useContext, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // <--- Importamos firestore
import { auth, db } from '../firebase/config'; 

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // 1. Intentamos leer los Custom Claims del token
                    const tokenResult = await firebaseUser.getIdTokenResult(true);
                    let userRole = tokenResult.claims.rol;

                    // 2. Si el token no tiene el rol, lo buscamos en la colección "usuarios" de Firestore
                    if (!userRole) {
                        const userDoc = await getDoc(doc(db, "usuarios", firebaseUser.uid));
                        if (userDoc.exists()) {
                            userRole = userDoc.data().rol;
                        }
                    }

                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        rol: userRole || 'cliente' // Si no está en ninguno, por seguridad es cliente
                    });
                } catch (err) {
                    console.error("Error al obtener los permisos del usuario:", err);
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        rol: 'cliente'
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};