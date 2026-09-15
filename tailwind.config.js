/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#062A67',
        royal: '#0878D1',
        cyan: '#13A9E5',
        gold: '#F5B400',
        lightbg: '#F2F8FC',
        darktext: '#071B3F',
      },
      fontFamily: {
        display: ['"Fredoka"', 'sans-serif'],
        body: ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
