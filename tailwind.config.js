/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
            },
            colors: {
                black: '#050505',
                void: '#0A0A0C',
                neon: '#00F0FF',
                violet: '#7C3AED',
                surface: '#111111'
            }
        },
    },
    plugins: [],
}
