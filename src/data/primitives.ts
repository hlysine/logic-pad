export interface Position {
  readonly x: number;
  readonly y: number;
}

export interface Edge {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}

export enum State {
  Error = 'error',
  Satisfied = 'satisfied',
  Incomplete = 'incomplete',
}

export type RuleState =
  | {
    readonly state: State.Error;
    readonly positions: readonly Position[];
  }
  | {
    readonly state: State.Satisfied;
  }
  | {
    readonly state: State.Incomplete;
  };

export interface GridState {
  final: State;
  rules: readonly RuleState[];
  symbols: ReadonlyMap<string, State[]>;
}

// TODO: @Meldiron New color OK
export enum Color {
  Dark = 'dark',
  Light = 'light',
  Gray = 'gray',
  Red = 'red',
  Orange = 'orange',
  Yellow = 'yellow',
  Lime = 'lime',
  Green = 'green',
  Teal = 'teal',
  Cyan = 'cyan',
  Blue = 'blue',
  Sky = 'sky',
  Indigo = 'indigo',
  Slate = 'slate',
  Purple = 'purple'
}

// TODO: @Meldiron New color OK
export const ColorToChar = {
  'dark': 'B',
  'light': 'W',
  'gray': 'n',
  'red': 'R',
  'orange': 'O',
  'yellow': 'Y',
  'lime': 'L',
  'green': 'G',
  'teal': 'T',
  'cyan': 'C',
  'blue': 'BL',
  'sky': 'S',
  'indigo': 'I',
  'slate': 'SL',
  'purple': 'P',
};

// TODO: @Meldiron New color OK
export enum ColorClasses {
  Dark = 'bg-[#1a1c2c] hover:!bg-[#1a1c2c] activate:!bg-[#1a1c2c] focus:!bg-[#1a1c2c] border border-[#f4f4f4] text-[#f4f4f4]',
  Light = 'bg-[#f4f4f4] hover:!bg-[#f4f4f4] activate:!bg-[#f4f4f4] focus:!bg-[#f4f4f4] border border-[#f4f4f4] text-[#1a1c2c]',
  Red = 'bg-[#b13e53] hover:!bg-[#b13e53] activate:!bg-[#b13e53] focus:!bg-[#b13e53] border border-[#b13e53] text-[#f4f4f4]',
  Purple = 'bg-[#5d275d] hover:!bg-[#5d275d] activate:!bg-[#5d275d] focus:!bg-[#5d275d] border border-[#5d275d] text-[#f4f4f4]',
  Orange = 'bg-[#ef7d57] hover:!bg-[#ef7d57] activate:!bg-[#ef7d57] focus:!bg-[#ef7d57] border border-[#ef7d57] text-[#f4f4f4]',
  Yellow = 'bg-[#ffcd75] hover:!bg-[#ffcd75] activate:!bg-[#ffcd75] focus:!bg-[#ffcd75] border border-[#ffcd75] text-[#f4f4f4]',
  Lime = 'bg-[#a7f070] hover:!bg-[#a7f070] activate:!bg-[#a7f070] focus:!bg-[#a7f070] border border-[#a7f070] text-[#f4f4f4]',
  Green = 'bg-[#38b764] hover:!bg-[#38b764] activate:!bg-[#38b764] focus:!bg-[#38b764] border border-[#38b764] text-[#f4f4f4]',
  Teal = 'bg-[#257179] hover:!bg-[#257179] activate:!bg-[#257179] focus:!bg-[#257179] border border-[#257179] text-[#f4f4f4]',
  Cyan = 'bg-[#73eff7] hover:!bg-[#73eff7] activate:!bg-[#73eff7] focus:!bg-[#73eff7] border border-[#73eff7] text-[#f4f4f4]',
  Blue = 'bg-[#3b5dc9] hover:!bg-[#3b5dc9] activate:!bg-[#3b5dc9] focus:!bg-[#3b5dc9] border border-[#3b5dc9] text-[#f4f4f4]',
  Sky = 'bg-[#41a6f6] hover:!bg-[#41a6f6] activate:!bg-[#41a6f6] focus:!bg-[#41a6f6] border border-[#41a6f6] text-[#f4f4f4]',
  Indigo = 'bg-[#29366f] hover:!bg-[#29366f] activate:!bg-[#29366f] focus:!bg-[#29366f] border border-[#29366f] text-[#f4f4f4]',
  Slate = 'bg-[#94b0c2] hover:!bg-[#94b0c2] activate:!bg-[#94b0c2] focus:!bg-[#94b0c2] border border-[#94b0c2] text-[#f4f4f4]',
}

// TODO: @Meldiron New color OK
export const CharToColor: {
  [key: string]: Color
} = {
  'n': Color.Gray,
  'b': Color.Dark,
  'w': Color.Light,
  'r': Color.Red,
  'o': Color.Orange,
  'y': Color.Yellow,
  'l': Color.Lime,
  'g': Color.Green,
  't': Color.Teal,
  'c': Color.Cyan,
  'bl': Color.Blue,
  's': Color.Sky,
  'i': Color.Indigo,
  'p': Color.Purple,
  'sl': Color.Slate,
}

export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

export const DIRECTIONS: readonly Direction[] = [
  Direction.Up,
  Direction.Down,
  Direction.Left,
  Direction.Right,
];

export enum Mode {
  Create = 'create',
  Solve = 'solve',
}
