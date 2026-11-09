import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth"; // <--- Importamos las funciones de persistencia
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC6KgULwaEZbCPiZIDACzL2HjrBVYkh9aU",
    authDomain: "mi-ecommerce-react-2e01c.firebaseapp.com",
    projectId: "mi-ecommerce-react-2e01c",
    storageBucket: "mi-ecommerce-react-2e01c.firebasestorage.app",
    messagingSenderId: "145419196573",
    appId: "1:145419196573:web:6556d78b2483198cac9c74",
    measurementId: "G-VLTSTW6QL1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// 🔒 Cambiamos la persistencia a modo sesión de pestaña: 
// Al cerrar el navegador o la pestaña, la sesión se destruye y te pedirá loguearte de nuevo.
setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error("Error configurando la persistencia de auth:", error);
});

export const db = getFirestore(app);
export const storage = getStorage(app);