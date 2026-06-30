/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7b39fc',
          light: '#965eff',
          dark: '#5c1cdd',
        },
        secondary: {
          DEFAULT: '#2b2344',
          light: '#3c325e',
          dark: '#1c162e',
        },
        'white-70': 'rgba(255, 255, 255, 0.7)',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        cabin: ['Cabin', 'sans-serif'],
        'instrument-serif': ['"Instrument Serif"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwindcss/plugin')(function({ addVariant }) {
      addVariant('app', 'body.is-mobile-app &');
    })
  ],
}
