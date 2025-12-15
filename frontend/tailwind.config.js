/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#0f0f23',
          secondary: '#1a1b2e',
          card: '#25283d',
          border: '#2d3748',
        }
      },
    },
  },
  plugins: [],
}