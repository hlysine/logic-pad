import GridData from './grid';
import {
  Color,
  DIRECTIONS,
  Direction,
  DirectionToggle,
  ORIENTATIONS,
  Orientation,
  OrientationToggle,
} from './primitives';

export enum ConfigType {
  Boolean = 'boolean',
  Number = 'number',
  String = 'string',
  Color = 'color',
  Direction = 'direction',
  DirectionToggle = 'directionToggle',
  Orientation = 'orientation',
  OrientationToggle = 'orientationToggle',
  Tile = 'tile',
  Solution = 'solution',
  Grid = 'grid',
  Icon = 'icon',
}

export interface Config<T> {
  readonly type: ConfigType;
  readonly field: string;
  readonly description: string;
  readonly default: T;
  readonly configurable: boolean;
}

export interface BooleanConfig extends Config<boolean> {
  readonly type: ConfigType.Boolean;
}

export interface NumberConfig extends Config<number> {
  readonly type: ConfigType.Number;
  readonly min?: number;
  readonly max?: number;
}

export interface StringConfig extends Config<string> {
  readonly type: ConfigType.String;
  readonly maxLength?: number;
  readonly placeholder?: string;
}

export interface ColorConfig extends Config<Color> {
  readonly type: ConfigType.Color;
  readonly allowGray: boolean;
}

export interface DirectionConfig extends Config<Direction> {
  readonly type: ConfigType.Direction;
}

export interface DirectionToggleConfig extends Config<DirectionToggle> {
  readonly type: ConfigType.DirectionToggle;
}

export interface OrientationConfig extends Config<Orientation> {
  readonly type: ConfigType.Orientation;
}

export interface OrientationToggleConfig extends Config<OrientationToggle> {
  readonly type: ConfigType.OrientationToggle;
}

export interface TileConfig extends Config<GridData> {
  readonly type: ConfigType.Tile;
  readonly resizable: boolean;
}

export interface SolutionConfig extends Config<GridData> {
  readonly type: ConfigType.Solution;
}

export interface GridConfig extends Config<GridData> {
  readonly type: ConfigType.Grid;
}

export interface IconConfig extends Config<string> {
  readonly type: ConfigType.Icon;
}

export type AnyConfig =
  | BooleanConfig
  | NumberConfig
  | StringConfig
  | ColorConfig
  | DirectionConfig
  | DirectionToggleConfig
  | OrientationConfig
  | OrientationToggleConfig
  | TileConfig
  | SolutionConfig
  | GridConfig
  | IconConfig;

/**
 * Compare two config values for equality, using an appropriate method for the config type.
 *
 * @param type The type of the config.
 * @param a The first value to compare.
 * @param b The second value to compare.
 * @returns Whether the two values are equal.
 */
export function configEquals<C extends AnyConfig>(
  type: C['type'],
  a: C['default'],
  b: C['default']
): boolean {
  if (
    type === ConfigType.Tile ||
    type === ConfigType.Grid ||
    type === ConfigType.Solution
  ) {
    return (a as GridData).equals(b as GridData);
  }
  if (type === ConfigType.DirectionToggle) {
    return DIRECTIONS.every(
      dir => (a as DirectionToggle)[dir] === (b as DirectionToggle)[dir]
    );
  }
  if (type === ConfigType.OrientationToggle) {
    return ORIENTATIONS.every(
      dir => (a as OrientationToggle)[dir] === (b as OrientationToggle)[dir]
    );
  }
  return a === b;
}
