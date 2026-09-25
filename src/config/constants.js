// src/config/constants.js
export const SITE_CONFIG = {
    nombre: "ReactBurger",
    descripcion: "Especialistas en hamburguesas artesanales y eventos privados.",

    // Links de navegación principal (Navbar)
    mainNav: [
        { label: 'Inicio', to: '/' },
        { label: 'Menú', to: '/menu' },
        { label: 'Contacto', to: '/contacto' }
    ],
    
    // Links de navegación del Footer
    footerNav: [
        { label: 'Términos', href: '#terminos' },
        { label: 'Privacidad', href: '#privacidad' },
        { label: 'Soporte', href: '/contacto' } // Actualizado a la ruta real
    ],

    // Datos de WhatsApp
    whatsapp: {
        number: import.meta.env.VITE_WHATSAPP_NUMBER || "",
        defaultMessage: import.meta.env.VITE_WHATSAPP_DEFAULT_MESSAGE || "Hola, quiero hacer una consulta",
    },

    // Información de Contacto y Ubicación
    contacto: {
        telefono: "+54 11 1234-5678",
        direccion: "C. 15 A & Calle 461 B, City Bell",
        ubicacion: "Buenos Aires, Argentina",
        email: "contacto@tudominio.com",
        instagram: "https://instagram.com/tu_usuario",
        facebook: "https://facebook.com/tu_pagina",
        mapsUrl: "https://www.google.com/maps",
        mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3273.475648592977!2d-58.06203882405207!3d-34.869400472860264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a2de8f212a5703%3A0xb12c4e0924168a62!2sC.%2015%20A%20%26%20Calle%20461%20B%2C%20B1896%20City%20Bell%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1784848162756!5m2!1ses-419!2sar"
    },

    // Credenciales EmailJS
    emailjs: {
        serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
        templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
    }
};