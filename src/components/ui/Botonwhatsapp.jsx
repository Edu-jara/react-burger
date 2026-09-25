import { useState } from 'react';
import PropTypes from 'prop-types';
import logoWpp from '../../assets/whatsapp-logo.png';
import { SITE_CONFIG } from '../../config/constants';

export default function BotonWhatsApp({ 
    numero = SITE_CONFIG.whatsapp.number, 
    mensaje = SITE_CONFIG.whatsapp.defaultMessage,
    flotante = true, 
    alHacerClic 
}) {
    const [mostrarGlobo, setMostrarGlobo] = useState(true);

    const manejarClick = () => {
        if (flotante) {
            const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        } else if (alHacerClic) {
            alHacerClic();
        }
    };

    if (!flotante) {
        return (
            <button 
                onClick={manejarClick}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
                Reservar por WhatsApp
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {mostrarGlobo && (
                /* 'hidden md:flex' -> Invisible en celular, visible en escritorio */
                <div className="hidden md:flex animate-fade-in mb-3 pointer-events-auto">
                    <div className="bg-neutral-900 border border-neutral-800 text-white px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-medium whitespace-nowrap items-center gap-3">
                        <span>¡Hacé tu consulta aquí! 👇</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setMostrarGlobo(false);
                            }}
                            className="text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg text-sm font-bold p-1 transition-colors"
                            aria-label="Cerrar aviso"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* El botón redondo se mantiene siempre visible y accesible */}
            <button 
                onClick={manejarClick} 
                className="pointer-events-auto bg-green-500 hover:bg-green-600 active:scale-95 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-400/50"
                aria-label="Contactar por WhatsApp"
            >
                <img src={logoWpp} alt="WhatsApp" className="w-7 h-7 object-contain select-none" />
            </button>
        </div>
    );
}

BotonWhatsApp.propTypes = {
    numero: PropTypes.string,
    mensaje: PropTypes.string,
    flotante: PropTypes.bool,
    alHacerClic: PropTypes.func,
};