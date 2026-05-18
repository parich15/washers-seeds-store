/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,vue,ts}",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        main: 'rgb(54, 169, 225)',
        secondary: 'rgb(58, 170, 53)',
        extra: 'rgb(147, 96, 55)',
      },
      fontFamily: {
        main: ['Walking in the street', 'sans-serif'],
        text: [ 'sans-serif'],
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(120deg, rgb(54, 169, 225), rgb(58, 170, 53))',
        'gradient-reverse': 'linear-gradient(120deg, rgb(58, 170, 53), rgb(54, 169, 225))',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in',
        'slide-up': 'slideUp 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
