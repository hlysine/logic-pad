import themes from 'daisyui/src/theming/themes';
import plugin from 'tailwindcss/plugin';
import { Config } from 'tailwindcss';
import daisyui from 'daisyui';

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
  const result: Record<string, string> = {};
  for (const shape of shapes)
    for (const [posName, posValue] of Object.entries(pos))
      result[`${shape}-${posName}`] = `${shape} at ${posValue}`;

  return result;
}

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
  plugins: [daisyui, radialGradientPlugin],
  daisyui: {
    themes: [
      {
        light: {
          'color-scheme': 'light',
          primary: '#185abd',
          'primary-content': '#ffffff',
          secondary: 'oklch(69.71% 0.329 342.55)',
          'secondary-content': 'oklch(98.71% 0.0106 342.55)',
          accent: '#8f8569',
          'accent-content': '#ffffff',
          neutral: '#e0e0e0',
          'neutral-content': '#555555',
          'base-100': '#F9F9F9',
          'base-200': '#F3F3F3',
          'base-300': '#E5E6E6',
          'base-content': '#1f2937',
          'error-content': '#ffffff',
          'success-content': '#ffffff',
          info: '#c2d5f2',
        },
      },
      {
        dark: {
          ...themes.dark,
          neutral: '#343c47',
        },
      },
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
      {
        aqua: {
          ...themes.aqua,
          accent: '#ffe999',
          'neutral-content': '#ffffff',
          success: '#5ad579',
        },
      },
      {
        lofi: {
          ...themes.lofi,
          neutral: '#101010',
          accent: '#999',
        },
      },
      'pastel',
      'fantasy',
      'wireframe',
      {
        black: {
          ...themes.black,
          accent: '#999',
        },
      },
      {
        luxury: {
          ...themes.luxury,
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
} satisfies Config;
export default tailwindConfig;
