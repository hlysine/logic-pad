import { Color } from '../data/primitives';
import { cn } from '../utils';

export function bg(color: Color) {
  switch (color) {
    case Color.Dark:
      return cn('bg-black hover:bg-black');
    case Color.Light:
      return cn('bg-white hover:bg-white');
    case Color.Gray:
      return cn(
        'bg-neutral-content bg-opacity-20 hover:bg-neutral-content hover:bg-opacity-20'
      );
  }
}

export function fg(color: Color) {
  switch (color) {
    case Color.Dark:
      return cn('text-white');
    case Color.Light:
      return cn('text-black');
    case Color.Gray:
      return cn('text-black');
  }
}

export function color(buttons: number) {
  switch (buttons) {
    case 1:
      return Color.Dark;
    case 2:
      return Color.Light;
    default:
      return undefined;
  }
}
