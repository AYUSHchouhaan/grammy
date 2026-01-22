/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        grammarly: {
          primary: '#00c851',
          hover: '#009a3e',
          light: '#e8f5e8',
          lightest: '#f0fff0'
        }
      },
      zIndex: {
        'writing-assistant': '10000',
        'writing-panel': '10001'
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'spin': 'spin 1s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}