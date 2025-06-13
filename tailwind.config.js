/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        'soft-charcoal': '#1A1F1E',
        'faded-turquoise': '#84C3B2',
        'dark-faded-turquoise': '#3B5E59',
        'warm-tan': '#D9B08C',
        'bright-sand': '#FFCB9A',
        'pale-clay-white': '#F2EFE9',
        'soft-coral-pink': '#E8C3C7',

        // Semantic color mappings based on usage suggestions
        background: {
          base: '#1A1F1E', // Soft Charcoal
          content: '#F2EFE9', // Pale Clay White
        },
        accent: {
          primary: '#84C3B2', // Faded Turquoise
          secondary: '#3B5E59', // Dark Faded Turquoise
          highlight: '#FFCB9A', // Bright Sand / Gold
          decorative: '#E8C3C7', // Soft Coral Pink
        },
        text: {
          primary: '#84C3B2', // Faded Turquoise
          link: '#D9B08C', // Warm Tan
          heading: '#F2EFE9', // Pale Clay White
        },
      },
    },
  },
  plugins: [],
};
