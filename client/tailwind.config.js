/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      // You can extend your theme here for dark mode specific colors if needed
      // For example:
      // colors: {
      //   dark: {
      //     primary: '#0D1117', // GitHub dark background
      //     secondary: '#161B22', // GitHub dark lighter background
      //     text: '#C9D1D9', // GitHub dark text
      //     border: '#30363D',
      //   }
      // }
    },
  },
  plugins: [],
}