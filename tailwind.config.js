import themes from 'daisyui/src/theming/themes';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'glow-md': '0px 0px 15px -3px rgba(0, 0, 0, 0.3)',
        'glow-xl': '0px 0px 43px -3px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      {
        lofi: {
          ...themes['lofi'],
          neutral: '#101010',
          accent: '#999',
        },
      },
      'pastel',
      'fantasy',
      'wireframe',
      {
        black: {
          ...themes['black'],
          accent: '#999',
        },
      },
      {
        luxury: {
          ...themes['luxury'],
          accent: '#946573',
        },
      },
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset',
    ],
  },
};
