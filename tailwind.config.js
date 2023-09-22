/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.jsx"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '2rem',
        screens: {
            sm: '560px',
            md: '760px',
            lg: '980px',
            xl: '1200px',
            '2xl': '1270px',
        },
      },
    },
  },
  plugins: [],
}

