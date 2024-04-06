import themes from 'daisyui/src/theming/themes';
import plugin from 'tailwindcss/plugin';

const radialGradientPlugin = plugin(
  function ({ matchUtilities, theme }) {
    matchUtilities(
      {
        // map to bg-radient-[*]
        'bg-radient': value => ({
          'background-image': `radial-gradient(${value},var(--tw-gradient-stops))`,
        }),
      },
      { values: theme('radialGradients') }
    );
  },
  {
    theme: {
      radialGradients: _presets(),
    },
  }
);

/**
 * utility class presets
 */
function _presets() {
  const shapes = ['circle', 'ellipse'];
  const pos = {
    c: 'center',
    t: 'top',
    b: 'bottom',
    l: 'left',
    r: 'right',
    tl: 'top left',
    tr: 'top right',
    bl: 'bottom left',
    br: 'bottom right',
  };
  let result = {};
  for (const shape of shapes)
    for (const [posName, posValue] of Object.entries(pos))
      result[`${shape}-${posName}`] = `${shape} at ${posValue}`;

  return result;
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'glow-md': '0px 0px 15px -3px rgba(0, 0, 0, 0.3)',
        'glow-xl': '0px 0px 43px -3px rgba(0, 0, 0, 0.3)',
        'glow-3xl': '0px 0px 60px -3px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [require('daisyui'), radialGradientPlugin],
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
