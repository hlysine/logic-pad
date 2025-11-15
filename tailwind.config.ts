import { Config } from 'tailwindcss';

const tailwindConfig = {
  content: ['./index.html', './src/client/**/*.{js.jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'glow-md': '0px 0px 15px -3px rgba(0, 0, 0, 0.3)',
        'glow-xl': '0px 0px 43px -3px rgba(0, 0, 0, 0.3)',
        'glow-3xl': '0px 0px 60px -3px rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        serif: [
          'Palatino Linotype',
          'Palatino',
          'Palatino LT STD',
          'Book Antiqua',
          'Georgia',
          'serif',
        ],
      },
    },
  },
} satisfies Config;
export default tailwindConfig;
