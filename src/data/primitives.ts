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

export enum Color {
  Black = 'black',
  White = 'white',
  None = 'none',
}

export enum Mode {
  Readonly = 0,
  Playable = 1,
  Editable = 2,
}
