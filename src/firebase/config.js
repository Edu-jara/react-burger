import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
export const db = getFirestore(app);