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

export const siteOptions = {
  reducedMotionOverride:
    window.localStorage.getItem('reducedMotion') === 'true',
};

export const prefersReducedMotion = () =>
  siteOptions.reducedMotionOverride ||
  // @ts-expect-error for browser support
  window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
  window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
