import React from 'react';
import { SITE_CONFIG } from '../../config/constants';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { nombre, footerNav, contacto } = SITE_CONFIG;

    return (
        <footer className="bg-zinc-900 border-t border-zinc-800 text-zinc-400 py-8">
            <div className="max-w-7xl mx-auto px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
                
                {/* Copyright & Marca */}
                <p className="text-sm text-center md:text-left">
                    © {currentYear}{' '}
                    <span className="text-amber-500 font-bold">{nombre || 'ReactBurger'}</span>
                    . Todos los derechos reservados.
                </p>

                {/* Navegación Secundaria & Redes Sociales */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Enlaces Legales */}
                    {footerNav && footerNav.length > 0 && (
                        <nav aria-label="Navegación de pie de página">
                            <ul className="flex flex-wrap justify-center space-x-6 text-sm">
                                {footerNav.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="hover:text-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded px-1"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}

                    {/* Redes Sociales  */}
                    {(contacto?.instagram || contacto?.facebook) && (
                        <div className="flex items-center space-x-4 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-3 sm:pt-0 sm:pl-4">
                            {contacto.instagram && (
                                <a
                                    href={contacto.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="hover:text-[#E4405F] transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 rounded p-1"
                                >
                                    Instagram
                                </a>
                            )}
                            {contacto.facebook && (
                                <a
                                    href={contacto.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="hover:text-[#1877F2] transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 rounded p-1"
                                >
                                    Facebook
                                </a>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </footer>
    );
}