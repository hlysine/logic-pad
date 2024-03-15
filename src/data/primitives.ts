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
  rules: readonly RuleState[];
  symbols: ReadonlyMap<string, State[]>;
}

export enum Color {
  Dark = 'dark',
  Light = 'light',
  Gray = 'gray',
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
