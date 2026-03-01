/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        ds: {
          black: '#111111',
          dark: '#1A1A1A',
          900: '#222222',
          700: '#444444',
          500: '#777777',
          400: '#999999',
          300: '#BBBBBB',
          200: '#DDDDDD',
          100: '#EEEEEE',
          50: '#F5F5F3',
          white: '#FAFAF8',
          pure: '#FFFFFF',
          blue: '#2563EB',
          'blue-hover': '#1D4FD7',
        },
      },
      fontFamily: {
        sans: ['Satoshi', 'sans-serif'],
      },
      borderRadius: {
        'pill': '100px',
      },
      maxWidth: {
        'content': '1100px',
        'cards': '1200px',
        'cta': '800px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
