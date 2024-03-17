import { Color, State } from '../data/primitives';
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
      return cn('text-neutral-content');
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

export function instructionBg(state: State) {
  switch (state) {
    case State.Satisfied:
      return cn(
        'bg-gradient-to-r from-success/50 via-primary/10 to-primary/10'
      );
    case State.Error:
      return cn('bg-gradient-to-r from-error/50 via-primary/10 to-primary/10');
    default:
      return cn('bg-primary/10');
  }
}

export function ringBorder(state: State) {
  switch (state) {
    case State.Satisfied:
      return cn('border-success shadow-glow-xl shadow-success');
    case State.Error:
      return cn('border-error/30 shadow-glow-md shadow-error');
    default:
      return cn('border-primary/10');
  }
}
