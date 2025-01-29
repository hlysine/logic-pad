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

/**
 * Major rules are frequently referenced in grids to provide additional UI.
 */
export enum MajorRule {
  MusicGrid = 'music',
  CompletePattern = 'complete_pattern',
  Underclued = 'underclued',
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

export enum Color {
  Dark = 'dark',
  Light = 'light',
  Gray = 'gray',
}

export enum Comparison {
  Equal = 'eq',
  AtLeast = 'ge',
  AtMost = 'le',
}

export const COMPARISONS: readonly Comparison[] = [
  Comparison.Equal,
  Comparison.AtLeast,
  Comparison.AtMost,
];

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

export type DirectionMap<T> = { [key in Direction]: T };

export type DirectionToggle = Readonly<DirectionMap<boolean>>;

export function directionToggle(...directions: readonly Direction[]) {
  const result = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  for (const direction of directions) {
    result[direction] = true;
  }
  return result;
}

export enum Orientation {
  Up = 'up',
  UpRight = 'up-right',
  Right = 'right',
  DownRight = 'down-right',
  Down = 'down',
  DownLeft = 'down-left',
  Left = 'left',
  UpLeft = 'up-left',
}

export const ORIENTATIONS: readonly Orientation[] = [
  Orientation.Up,
  Orientation.UpRight,
  Orientation.Right,
  Orientation.DownRight,
  Orientation.Down,
  Orientation.DownLeft,
  Orientation.Left,
  Orientation.UpLeft,
];

export type OrientationMap<T> = { [key in Orientation]: T };

export type OrientationToggle = Readonly<OrientationMap<boolean>>;

export function orientationToggle(...orientations: readonly Orientation[]) {
  const result = {
    up: false,
    'up-right': false,
    right: false,
    'down-right': false,
    down: false,
    'down-left': false,
    left: false,
    'up-left': false,
  };
  for (const orientation of orientations) {
    result[orientation] = true;
  }
  return result;
}

export enum Mode {
  Create = 'create',
  Solve = 'solve',
  Perfection = 'perfection',
}
