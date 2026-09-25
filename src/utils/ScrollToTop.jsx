 // Forzamos un salto instantáneo (behavior: 'instant') arriba de todo
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Forzamos un salto instantáneo (behavior: 'instant') arriba de todo
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
    }, [pathname]);

    return null;
}