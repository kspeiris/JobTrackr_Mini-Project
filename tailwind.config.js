/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./*.js"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                glass: {
                    DEFAULT: 'rgba(255, 255, 255, 0.7)',
                    dark: 'rgba(255, 255, 255, 0.9)',
                }
            }
        },
    },
    plugins: [],
}
