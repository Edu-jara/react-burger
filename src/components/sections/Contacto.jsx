import { useState } from 'react';
import emailjs from '@emailjs/browser';
import BotonWhatsApp from '../ui/Botonwhatsapp';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { Phone, Navigation, MapPin, Mail } from 'lucide-react';
import { SITE_CONFIG } from '../../config/constants';


function InputField({ label, name, type = 'text', required = false, isTextArea = false, value, onChange, placeholder, rows = 4 }) {
    const inputClasses = "w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors";

    return (
        <div>
            <label htmlFor={name} className="block text-xs font-semibold text-neutral-300 mb-1">
                {label} {required && '*'}
            </label>
            {isTextArea ? (
                <textarea
                    id={name}
                    name={name}
                    required={required}
                    rows={rows}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`${inputClasses} resize-none`}
                />
            ) : (
                <input
                    id={name}
                    type={type}
                    name={name}
                    required={required}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={inputClasses}
                />
            )}
        </div>
    );
}

export default function Contacto() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
    });

    const [enviando, setEnviando] = useState(false);
    const [estadoEnvio, setEstadoEnvio] = useState(null);

    const { contacto, emailjs: emailConfig, whatsapp } = SITE_CONFIG;

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const abrirWhatsApp = () => {
        if (!whatsapp.number) {
            console.warn('Número de WhatsApp no configurado en SITE_CONFIG');
            return;
        }
        const url = `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(whatsapp.defaultMessage)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        
        // Validación defensiva: verificar credenciales de EmailJS
        if (!emailConfig.serviceId || !emailConfig.templateId || !emailConfig.publicKey) {
            console.error('Faltan configurar variables de entorno de EmailJS en .env');
            setEstadoEnvio('error');
            return;
        }

        setEnviando(true);
        setEstadoEnvio(null);

        try {
            await emailjs.send(
                emailConfig.serviceId,
                emailConfig.templateId,
                {
                    from_name: formData.nombre,
                    from_email: formData.email,
                    phone: formData.telefono,
                    message: formData.mensaje,
                },
                emailConfig.publicKey
            );

            setEstadoEnvio('exito');
            setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            setEstadoEnvio('error');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <section id="Contacto" className="py-8 md:py-12 bg-neutral-950 text-white px-4 md:px-12 rounded-2xl md:rounded-3xl my-6 md:my-8 border border-neutral-800 shadow-2xl">
            <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">

                {/* ENCABEZADO PRINCIPAL */}
                <div className="text-center md:text-left max-w-2xl">
                    <span className="text-green-500 text-xs font-bold uppercase tracking-wider bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                        Contacto Directo
                    </span>
                    <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mt-3">
                        ¿Organizando un evento? Hablemos hoy.
                    </h2>
                    <p className="text-neutral-400 text-sm md:text-base mt-2 leading-relaxed">
                        Escribinos por WhatsApp para respuesta inmediata o completá el formulario.
                    </p>
                </div>

                {/* BOTÓN WHATSAPP  EN MÓVIL */}
                <div className="block lg:hidden bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-center space-y-2">
                    <p className="text-xs text-neutral-400 font-medium">¿Querés una respuesta inmediata?</p>
                    <BotonWhatsApp flotante={false} alHacerClic={abrirWhatsApp} />
                </div>

                {/* GRID PRINCIPAL */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">

                    {/* FORMULARIO DE CONTACTO */}
                    <div className="order-1 lg:order-2 bg-neutral-900/80 p-6 md:p-8 rounded-2xl border border-neutral-800/80 backdrop-blur-sm shadow-xl flex flex-col justify-between">
                        <form onSubmit={manejarEnvio} className="space-y-4 flex-1 flex flex-col justify-between">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white mb-4 border-b border-neutral-800 pb-2 flex items-center gap-2">
                                    <span>✉️</span> Formulario de Contacto
                                </h3>

                                <InputField
                                    label="Nombre Completo"
                                    name="nombre"
                                    required
                                    value={formData.nombre}
                                    onChange={manejarCambio}
                                    placeholder="Ej. Valeria Gómez"
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        label="Email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={manejarCambio}
                                        placeholder="valeria@ejemplo.com"
                                    />
                                    <InputField
                                        label="Teléfono"
                                        name="telefono"
                                        type="tel"
                                        value={formData.telefono}
                                        onChange={manejarCambio}
                                        placeholder="+54 11 ..."
                                    />
                                </div>

                                <InputField
                                    label="Mensaje o Detalles del Evento"
                                    name="mensaje"
                                    isTextArea
                                    required
                                    rows={4}
                                    value={formData.mensaje}
                                    onChange={manejarCambio}
                                    placeholder="Contanos fecha tentativa, cantidad de invitados o tipo de evento..."
                                />
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={enviando}
                                    className="w-full bg-neutral-100 text-black font-bold py-3.5 px-6 rounded-xl 
                                    transition-all duration-300 ease-in-out
                                    hover:bg-white hover:scale-[1.02] hover:shadow-xl hover:shadow-white/10
                                    active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed 
                                    disabled:hover:scale-100 disabled:hover:shadow-none
                                    flex items-center justify-center gap-2 text-sm shadow-lg cursor-pointer"
                                >
                                    {enviando ? <span>Enviando mensaje...</span> : <span>Enviar Consulta ✉️</span>}
                                </button>

                                {estadoEnvio === 'exito' && (
                                    <p className="text-xs text-green-400 text-center font-medium pt-3">
                                        ¡Mensaje enviado con éxito! Te responderemos a la brevedad.
                                    </p>
                                )}
                                {estadoEnvio === 'error' && (
                                    <p className="text-xs text-red-400 text-center font-medium pt-3">
                                        Hubo un problema al enviar. Intentá nuevamente o escribinos por WhatsApp.
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* DATOS DE CONTACTO */}
                    <div className="order-2 lg:order-1 space-y-6 flex flex-col justify-between">

                        {/* Reseñas de Google */}
                        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-3">
                                <span className="text-amber-500 text-xl">⭐</span>
                                <div>
                                    <p className="text-sm font-semibold text-white">Opiniones reales</p>
                                    <p className="text-xs text-neutral-400">Ver calificaciones en Google Maps</p>
                                </div>
                            </div>
                            <a
                                href={contacto.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-amber-500 hover:bg-amber-400 hover:scale-105 active:scale-95 text-neutral-950 font-bold text-xs px-4 py-2.5 rounded-lg transition-all shadow-md"
                            >
                                Ver ↗
                            </a>
                        </div>

                        {/* Datos directos */}
                        <div className="bg-neutral-900/60 p-5 md:p-6 rounded-2xl border border-neutral-800/80 space-y-4 text-sm">
                            <div className="flex items-center space-x-3">
                                <Phone className="text-amber-500 w-5 h-5 flex-shrink-0" />
                                <span><strong>Teléfono:</strong> {contacto.telefono}</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Navigation className="text-amber-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span><strong>Dirección:</strong> {contacto.direccion}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="text-amber-500 w-5 h-5 flex-shrink-0" />
                                <span><strong>Ubicación:</strong> {contacto.ubicacion}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="text-amber-500 w-5 h-5 flex-shrink-0" />
                                <span><strong>Email:</strong> {contacto.email}</span>
                            </div>
                        </div>

                        {/* Redes Sociales */}
                        <div>
                            <p className="text-xs text-neutral-400 mb-3 uppercase tracking-wider font-semibold">Seguinos en redes:</p>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={contacto.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-xl hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-2.5 group"
                                    aria-label="Instagram">
                                    <FaInstagram className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium text-neutral-200">Instagram</span>
                                </a>

                                <a
                                    href={contacto.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-xl hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-2.5 group"
                                    aria-label="Facebook">
                                    <FaFacebook className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium text-neutral-200">Facebook</span>
                                </a>
                            </div>
                        </div>

                        {/* WhatsApp visible en escritorio */}
                        <div className="hidden lg:block pt-2">
                            <p className="text-xs text-neutral-500 mb-2 font-medium">¿Preferís respuesta inmediata?</p>
                            <BotonWhatsApp flotante={false} alHacerClic={abrirWhatsApp} />
                        </div>

                    </div>

                </div>

                {/* MAPA DE GOOGLE */}
                <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
                    <iframe
                        src={contacto.mapsEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        title="Ubicación Google Maps"
                    ></iframe>
                </div>

            </div>
        </section>
    );
}