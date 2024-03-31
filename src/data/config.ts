import GridData from './grid';
import { Color, Direction, Orientation } from './primitives';

export enum ConfigType {
  Number = 'number',
  String = 'string',
  Color = 'color',
  Direction = 'direction',
  Orientation = 'orientation',
  Grid = 'grid',
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

export type AnyConfig =
  | NumberConfig
  | StringConfig
  | ColorConfig
  | DirectionConfig
  | OrientationConfig
  | GridConfig;
