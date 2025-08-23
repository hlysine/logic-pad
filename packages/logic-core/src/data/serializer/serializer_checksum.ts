import GridData from '../grid.js';
import GridConnections from '../gridConnections.js';
import Rule from '../rules/rule.js';
import TileData from '../tile.js';
import Symbol from '../symbols/symbol.js';
import {
  AnyConfig,
  ConfigType,
  IconConfig,
  NullableNoteConfig,
  NullableNumberConfig,
  NumberConfig,
  OrientationConfig,
} from '../config.js';
import { Puzzle, PuzzleData } from '../puzzle.js';
import { ControlLine } from '../rules/musicControlLine.js';
import GridZones from '../gridZones.js';
import SerializerV0, { orientationChars } from './serializer_v0.js';
import Instruction from '../instruction.js';
import {
  DIRECTIONS,
  DirectionToggle,
  ORIENTATIONS,
  OrientationToggle,
  Position,
} from '../primitives.js';
import { escape } from '../dataHelper.js';

export default class SerializerChecksum extends SerializerV0 {
  public readonly version = 1 as number;

  public parseTile(_str: string): TileData {
    throw new Error('Checksum serializer does not support parsing');
  }

  public stringifyControlLine(line: ControlLine): string {
    const result: string[] = [];
    result.push(`c${line.column}`);
    result.push(`r${line.rows.map(row => `n${row.note ?? ''}`).join(',')}`);
    return result.join('|');
  }

  public parseControlLine(_str: string): ControlLine {
    throw new Error('Checksum serializer does not support parsing');
  }

  public stringifyConfig(instruction: Instruction, config: AnyConfig): string {
    switch (config.type) {
      case ConfigType.Boolean:
        return (
          config.field +
          '=' +
          (instruction[config.field as keyof Instruction] ? '1' : '0')
        );
      case ConfigType.Number:
      case ConfigType.Color:
      case ConfigType.Comparison:
      case ConfigType.Wrapping:
      case ConfigType.Direction:
      case ConfigType.Orientation:
        return (
          config.field +
          '=' +
          String(
            instruction[config.field as keyof Instruction] as
              | OrientationConfig['default']
              | NumberConfig['default']
          )
            .toLowerCase()
            .trim()
        );
      case ConfigType.NullableBoolean:
        return (
          config.field +
          '=' +
          (instruction[config.field as keyof Instruction] === null
            ? ''
            : instruction[config.field as keyof Instruction]
              ? '1'
              : '0')
        );
      case ConfigType.NullableNumber:
        return (
          config.field +
          '=' +
          (instruction[config.field as keyof Instruction] === null
            ? ''
            : String(
                instruction[
                  config.field as keyof Instruction
                ] as NullableNumberConfig['default']
              ))
        );
      case ConfigType.DirectionToggle:
        return (
          config.field +
          '=' +
          DIRECTIONS.filter(
            dir =>
              (
                instruction[
                  config.field as keyof Instruction
                ] as unknown as DirectionToggle
              )[dir]
          )
            .map(x => orientationChars[x])
            .join('')
            .toLowerCase()
            .trim()
        );
      case ConfigType.OrientationToggle:
        return (
          config.field +
          '=' +
          ORIENTATIONS.filter(
            dir =>
              (
                instruction[
                  config.field as keyof Instruction
                ] as unknown as OrientationToggle
              )[dir]
          )
            .map(x => orientationChars[x])
            .join('')
            .toLowerCase()
            .trim()
        );
      case ConfigType.String:
      case ConfigType.Icon:
        return (
          config.field +
          '=' +
          escape(
            (
              instruction[
                config.field as keyof Instruction
              ] as IconConfig['default']
            )
              .toLowerCase()
              .trim()
          )
        );
      case ConfigType.NullableNote:
        return (
          config.field +
          '=' +
          escape(
            instruction[config.field as keyof Instruction] === null
              ? ''
              : escape(
                  String(
                    instruction[
                      config.field as keyof Instruction
                    ] as NullableNoteConfig['default']
                  )
                    .toLowerCase()
                    .trim()
                )
          )
        );
      case ConfigType.Tile:
      case ConfigType.Grid:
        return (
          config.field +
          '=' +
          escape(
            this.stringifyGrid(
              instruction[
                config.field as keyof Instruction
              ] as unknown as GridData
            )
          )
        );
      case ConfigType.NullableGrid:
        return (
          config.field +
          '=' +
          escape(
            instruction[config.field as keyof Instruction] === null
              ? ''
              : this.stringifyGrid(
                  instruction[
                    config.field as keyof Instruction
                  ] as unknown as GridData
                )
          )
        );
      case ConfigType.ControlLines:
        return (
          config.field +
          '=' +
          escape(
            (
              instruction[
                config.field as keyof Instruction
              ] as unknown as ControlLine[]
            )
              .map(line => this.stringifyControlLine(line))
              .join(':')
          )
        );
      case ConfigType.SolvePath:
        return (
          config.field +
          '=' +
          escape(
            (
              instruction[
                config.field as keyof Instruction
              ] as unknown as Position[]
            )
              ?.map(pos => `${pos.x}_${pos.y}`)
              .join('/') ?? ''
          )
        );
    }
  }

  public parseConfig(
    _configs: readonly AnyConfig[],
    _entry: string
  ): [string, unknown] {
    throw new Error('Checksum serializer does not support parsing');
  }

  public parseRule(_str: string): Rule {
    throw new Error('Checksum serializer does not support parsing');
  }

  public parseSymbol(_str: string): Symbol {
    throw new Error('Checksum serializer does not support parsing');
  }

  public parseConnections(_input: string): GridConnections {
    throw new Error('Checksum serializer does not support parsing');
  }

  public stringifyZones(zones: GridZones): string {
    return `Z${zones.edges
      .map(
        edge =>
          `${edge.x1}_${edge.y1}_${edge.x2 - edge.x1}_${edge.y2 - edge.y1}`
      )
      .sort()
      .join(':')}`;
  }

  public parseZones(_input: string): GridZones {
    throw new Error('Checksum serializer does not support parsing');
  }

  public parseTiles(_input: string): TileData[][] {
    throw new Error('Checksum serializer does not support parsing');
  }

  public stringifyRules(rules: readonly Rule[]): string {
    return `R${rules
      .map(rule => this.stringifyRule(rule))
      .sort()
      .join(':')}`;
  }

  public parseRules(_input: string): Rule[] {
    throw new Error('Checksum serializer does not support parsing');
  }

  public stringifySymbols(
    symbols: ReadonlyMap<string, readonly Symbol[]>
  ): string {
    return `S${Array.from(symbols.values())
      .flat()
      .map(symbol => this.stringifySymbol(symbol))
      .sort()
      .join(':')}`;
  }

  public parseSymbols(_input: string): Map<string, Symbol[]> {
    throw new Error('Checksum serializer does not support parsing');
  }

  public parseGrid(_input: string): GridData {
    throw new Error('Checksum serializer does not support parsing');
  }

  public parseGridWithSolution(_input: string): PuzzleData {
    throw new Error('Checksum serializer does not support parsing');
  }

  public parsePuzzle(_input: string): Puzzle {
    throw new Error('Checksum serializer does not support parsing');
  }
}
