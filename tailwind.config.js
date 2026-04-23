/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf9ee',
          100: '#f9edca',
          200: '#f2d98a',
          300: '#e9c04e',
          400: '#d4a82a',
          500: '#b8952a',
          600: '#9a7820',
          700: '#7a5d1a',
          800: '#5e4716',
          900: '#473514',
        },
        cream: {
          50: '#fdfaf4',
          100: '#f9f2e2',
          200: '#f2e5c4',
          300: '#e8d4a0',
          400: '#d4b87a',
        },
        charcoal: {
          900: '#0f0f0f',
          800: '#1a1a1a',
          700: '#2d2d2d',
          600: '#404040',
          500: '#555555',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Lato"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-left': 'slideLeft 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
