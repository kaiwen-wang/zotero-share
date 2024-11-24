/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

