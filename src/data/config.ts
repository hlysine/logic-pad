import GridData from './grid';
import { Color, Direction, Orientation } from './primitives';

export enum ConfigType {
  Number = 'number',
  String = 'string',
  Color = 'color',
  Direction = 'direction',
  Orientation = 'orientation',
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

export interface OrientationConfig extends Config<Orientation> {
  readonly type: ConfigType.Orientation;
}

export interface GridConfig extends Config<GridData> {
  readonly type: ConfigType.Grid;
}

export interface IconConfig extends Config<string> {
  readonly type: ConfigType.Icon;
}

export type AnyConfig =
  | NumberConfig
  | StringConfig
  | ColorConfig
  | DirectionConfig
  | OrientationConfig
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
  if (type === ConfigType.Grid) {
    return (a as GridData).equals(b as GridData);
  }
  return a === b;
}
