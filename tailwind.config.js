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
      gridTemplateColumns: {
        sidebar: 'minmax(auto, 20rem) 1fr',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
