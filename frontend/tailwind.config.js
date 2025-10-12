/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'iraqi-green': '#007A3D',
        'iraqi-red': '#CE1126',
        'iraqi-black': '#000000',
        'iraqi-white': '#FFFFFF',
      },
      fontFamily: {
        'arabic': ['Cairo', 'Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
