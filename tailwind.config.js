/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a0b14', // Very dark blue/black
                panel: 'rgba(20, 25, 40, 0.8)', // Dark panel background
                'accent-gold': '#d4b483', // Example gold color
                'accent-cyan': '#4fd1c5', // Example cyan color
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Assuming user has Inter or system
            },
        },
    },
    plugins: [],
}
