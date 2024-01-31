/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        bg: '#DDDDDD',
        primary: '#660099',
        'primary-dark': '#648D1E',
        'primary-frame': 'rgba(183, 236, 93, 0.3)',
        'primary-linear': 'rgb(183, 236, 93)',
        secondary: '#DDDDDD',
        'secondary-dark': '#222222',
        'secondary-tint': '#f5f5f5',
        success: '#660099',
        'success-dark': '#648D1E',
        'success-tint': '#D9FF99',
        danger: '#660099',
        'danger-dark': '#A01600',
        'danger-tint': '#FFA394',
        'pen-black': '#F6F6F6',
        'pen-blue': '#0066FF',
        'pen-red': '#f93819',
        gray: {
          10: "#E6E6E6",
          20: "#CCCCCC",
          30: "#B3B3B3",
          40: "#999999",
          50: "#808080",
          60: "#DDDDDD",
          70: "#DDDDDD",
          80: "#000000",
          90: "#1A1A1A",
        },
      },
      animation: {},
      keyframes: {},
    },
  },
  plugins: [],
}