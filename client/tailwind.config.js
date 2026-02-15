/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
            },
            colors: {
                primary: "#0f172a", // Slate-900
                secondary: "#64748b", // Slate-500
                accent: "#d4af37", // Gold
                background: "#f8fafc", // Slate-50
            },
        },
    },
    plugins: [],
}
