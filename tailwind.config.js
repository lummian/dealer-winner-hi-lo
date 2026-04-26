/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        felt: {
          900: '#0a3d2e',
          800: '#0d4a37',
          700: '#11593f'
        }
      }
    }
  },
  plugins: []
};
