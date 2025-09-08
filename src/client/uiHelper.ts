import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: [{ shadow: ['glow-md', 'glow-xl', 'glow-3xl'] }],
    },
  },
});

const relativeTimeFormat = new Intl.RelativeTimeFormat('en');

export function toRelativeDate(
  date: Date,
  accuracy: 'second' | 'day' = 'second'
) {
  const msOffset = date.getTime() - Date.now();
  if (-msOffset < 10 * 1000 && accuracy === 'second') {
    return 'a few seconds ago';
  } else if (-msOffset < 60 * 1000 && accuracy === 'second') {
    return relativeTimeFormat.format(Math.round(msOffset / 1000), 'second');
  } else if (-msOffset < 60 * 60 * 1000 && accuracy === 'second') {
    return relativeTimeFormat.format(
      Math.round(msOffset / 1000 / 60),
      'minute'
    );
  } else if (-msOffset < 24 * 60 * 60 * 1000 && accuracy === 'second') {
    return relativeTimeFormat.format(
      Math.round(msOffset / 1000 / 60 / 60),
      'hour'
    );
  } else if (-msOffset < 24 * 60 * 60 * 1000) {
    return 'today';
  } else if (-msOffset < 30 * 24 * 60 * 60 * 1000) {
    return relativeTimeFormat.format(
      Math.round(msOffset / 1000 / 60 / 60 / 24),
      'day'
    );
  } else if (-msOffset < 365 * 24 * 60 * 60 * 1000) {
    return relativeTimeFormat.format(
      Math.round(msOffset / 1000 / 60 / 60 / 24 / 30),
      'month'
    );
  } else {
    return relativeTimeFormat.format(
      Math.round(msOffset / 1000 / 60 / 60 / 24 / 365),
      'year'
    );
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pluralize(count: number) {
  return (strings1: TemplateStringsArray, count1?: number) => {
    return (strings2: TemplateStringsArray, count2?: number) => {
      const singular =
        count2 === 1 || (count1 !== undefined && count1 !== 1)
          ? strings2
          : strings1;
      const plural = singular === strings1 ? strings2 : strings1;
      const strings = count === 1 ? singular : plural;
      if (strings.length === 1) return `${count} ${strings[0].trim()}`;
      return strings[0] + count + strings[1];
    };
  };
}

const epsilon = 0.001;

export function eq(a: number, b: number) {
  return Math.abs(a - b) < epsilon;
}

export const externalReducedMotion = () =>
  // @ts-expect-error for browser support
  window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
  window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;

export const mousePosition = { clientX: 0, clientY: 0 };

const updateMousePosition = (e: PointerEvent) => {
  mousePosition.clientX = e.clientX;
  mousePosition.clientY = e.clientY;
};

document.addEventListener('pointermove', updateMousePosition);
document.addEventListener('pointerdown', updateMousePosition);
document.addEventListener('pointerup', updateMousePosition);
document.addEventListener('pointerleave', updateMousePosition);
document.addEventListener('pointerenter', updateMousePosition);
document.addEventListener('pointerover', updateMousePosition);
document.addEventListener('pointerout', updateMousePosition);
