// ROOT/tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // Inter como la fuente por defecto para toda la app
                sans: ['Inter', 'sans-serif'], 
                // Figtree exclusiva para encabezados, logos y elementos clave
                display: ['Figtree', 'sans-serif'], 
            },
            colors: {
                brand: {
                   primary: "#E6758B", // Tonos salmón para CTAs y acentos fuertes
                    accent: "#F3BAC9",  // Salmón claro para hovers y fondos suaves
                    surface: "#FFF5F7", // Contraste de temperatura para tarjetas
                    canvas: "#fefdfd",  // Lienzo base principal
                    nav: "#fffbfb",     // Lienzo base para navegación
                }
            },
        },
    },
    plugins: [],
}