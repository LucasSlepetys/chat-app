/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      height: {
        minus16: 'calc(100% - 64px)',
      },
    },
  },
  plugins: [],
};
