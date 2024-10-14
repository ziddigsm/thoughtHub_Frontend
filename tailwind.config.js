/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/components/**/*.{jsx,css}",
    ],
  theme: {
    extend: {
      screens: {
        'max-sm': { 'max': '640px' }, 
        'max-md': { 'max': '768px' },  
        'max-lg': { 'max': '1024px' }, 
      },
      colors: {
        'thought': {
          '100': '#198b91',
          '200': '#1d6365'
        },
        'hub': {
          '100': '#2b3759'
        }
      }
    },
  },
  plugins: [],
}

