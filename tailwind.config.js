/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        "test": ["Charter"]
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

