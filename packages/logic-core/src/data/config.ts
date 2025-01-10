import GridData from './grid.js';
import {
  Color,
  Comparison,
  DIRECTIONS,
  Direction,
  DirectionToggle,
  ORIENTATIONS,
  Orientation,
  OrientationToggle,
} from './primitives.js';
import { ControlLine } from './rules/musicControlLine.js';

export enum ConfigType {
  Boolean = 'boolean',
  NullableBoolean = 'nullableBoolean',
  Number = 'number',
  NullableNumber = 'nullableNumber',
  String = 'string',
  Color = 'color',
  Comparison = 'comparison',
  Direction = 'direction',
  DirectionToggle = 'directionToggle',
  Orientation = 'orientation',
  OrientationToggle = 'orientationToggle',
  Tile = 'tile',
  Grid = 'grid',
  NullableGrid = 'nullableGrid',
  Icon = 'icon',
  ControlLines = 'controlLines',
  NullableNote = 'nullableNote',
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

export interface NullableBooleanConfig extends Config<boolean | null> {
  readonly type: ConfigType.NullableBoolean;
}

export interface NumberConfig extends Config<number> {
  readonly type: ConfigType.Number;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
}

export interface NullableNumberConfig extends Config<number | null> {
  readonly type: ConfigType.NullableNumber;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
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

export interface ComparisonConfig extends Config<Comparison> {
  readonly type: ConfigType.Comparison;
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

export interface GridConfig extends Config<GridData> {
  readonly type: ConfigType.Grid;
}

export interface NullableGridConfig extends Config<GridData | null> {
  readonly type: ConfigType.NullableGrid;
  readonly nonNullDefault: GridData;
}

export interface IconConfig extends Config<string> {
  readonly type: ConfigType.Icon;
}

export interface ControlLinesConfig extends Config<ControlLine[]> {
  readonly type: ConfigType.ControlLines;
}

export interface NullableNoteConfig extends Config<string | null> {
  readonly type: ConfigType.NullableNote;
}

export type AnyConfig =
  | BooleanConfig
  | NullableBooleanConfig
  | NumberConfig
  | NullableNumberConfig
  | StringConfig
  | ColorConfig
  | ComparisonConfig
  | DirectionConfig
  | DirectionToggleConfig
  | OrientationConfig
  | OrientationToggleConfig
  | TileConfig
  | GridConfig
  | NullableGridConfig
  | IconConfig
  | ControlLinesConfig
  | NullableNoteConfig;

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
  if (type === ConfigType.ControlLines) {
    const aLines = a as ControlLine[];
    const bLines = b as ControlLine[];
    if (aLines.length !== bLines.length) return false;
    return aLines.every((line, i) => line.equals(bLines[i]));
  }
  if (type === ConfigType.Tile || type === ConfigType.Grid) {
    return (a as GridData).equals(b as GridData);
  }
  if (type === ConfigType.NullableGrid) {
    if (a === null && b === null) return true;
    if (a === null || b === null) return false;
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
