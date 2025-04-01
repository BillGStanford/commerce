/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            light: '#4da6ff',
            DEFAULT: '#0066cc',
            dark: '#004d99',
          },
          secondary: {
            light: '#ffd699',
            DEFAULT: '#ffb733',
            dark: '#cc8800',
          },
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          heading: ['Poppins', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }