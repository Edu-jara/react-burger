import React from 'react';
import Hero from '../components/sections/Hero';
import Nosotros from '../components/sections/Nosotros';

export default function InicioPage() {
    return (
        <div className="space-y-16">
            <Hero />
            <Nosotros />
        </div>
    );
}