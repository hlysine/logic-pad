import { Color } from '../data/primitives';

export function bg(color: Color) {
  switch (color) {
    case Color.Black:
      return 'bg-black bg-opacity-60 hover:bg-black hover:bg-opacity-60';
    case Color.White:
      return 'bg-white bg-opacity-80 hover:bg-white hover:bg-opacity-80';
    case Color.None:
      return 'bg-gray-600 bg-opacity-50 hover:bg-gray-600 hover:bg-opacity-50';
  }
}

export function fg(color: Color) {
  switch (color) {
    case Color.Black:
      return 'text-white';
    case Color.White:
      return 'text-black';
    case Color.None:
      return 'text-gray-900';
  }
}

export function color(buttons: number) {
  switch (buttons) {
    case 1:
      return Color.Black;
    case 2:
      return Color.White;
    default:
      return undefined;
  }
}
