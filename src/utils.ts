import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: [{ shadow: ['glow-md', 'glow-xl', 'glow-3xl'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const epsilon = 0.001;

export function eq(a: number, b: number) {
  return Math.abs(a - b) < epsilon;
}

export const siteOptions = {
  reducedMotionOverride:
    window.localStorage.getItem('reducedMotion') === 'true',
};

export const externalReducedMotion = () =>
  // @ts-expect-error for browser support
  window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
  window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;

export const prefersReducedMotion = () =>
  siteOptions.reducedMotionOverride || externalReducedMotion();

export const mousePosition = { clientX: 0, clientY: 0 };

document.addEventListener('pointermove', e => {
  mousePosition.clientX = e.clientX;
  mousePosition.clientY = e.clientY;
});
