import { Color, State } from '../data/primitives';
import { cn } from '../utils';

// TODO: @Meldiron New color OK
export function bg(color: Color) {
  switch (color) {
    case Color.Dark:
      return cn('bg-[#1a1c2c] hover:bg-[#1a1c2c]');
    case Color.Red:
      return cn('bg-[#b13e53] hover:bg-[#b13e53]');
    case Color.Light:
      return cn('bg-[#f4f4f4] hover:bg-[#f4f4f4]');
    case Color.Orange:
      return cn('bg-[#ef7d57] hover:bg-[#ef7d57]');
    case Color.Yellow:
      return cn('bg-[#ffcd75] hover:bg-[#ffcd75]');
    case Color.Lime:
      return cn('bg-[#a7f070] hover:bg-[#a7f070]');
    case Color.Green:
      return cn('bg-[#38b764] hover:bg-[#38b764]');
    case Color.Teal:
      return cn('bg-[#257179] hover:bg-[#257179]');
    case Color.Cyan:
      return cn('bg-[#73eff7] hover:bg-[#73eff7]');
    case Color.Blue:
      return cn('bg-[#3b5dc9] hover:bg-[#3b5dc9]');
    case Color.Sky:
      return cn('bg-[#41a6f6] hover:bg-[#41a6f6]');
    case Color.Indigo:
      return cn('bg-[#29366f] hover:bg-[#29366f]');
    case Color.Slate:
      return cn('bg-[#94b0c2] hover:bg-[#94b0c2]');
    case Color.Purple:
      return cn('bg-[#5d275d] hover:bg-[#5d275d]');
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

  return '';
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
