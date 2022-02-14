module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // or false or 'class'
  theme: {
    fontFamily: {
      sans: "'Open Sans', sans-serif",
      body: "'Open Sans', sans-serif",
      heading: "'PT Sans', sans-serif",
      caption: "'PT Sans Caption', sans-serif",
      'heading-narrow': "'PT Sans Narrow', sans-serif",
    },
    extend: {
      gridTemplateRows: {
        sandwich: 'auto 1fr auto',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-hero-patterns')],
}
