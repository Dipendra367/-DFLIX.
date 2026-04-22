/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dflix: '#8b5cf6', // modern violet
        dflix_dark: '#6d28d9',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
