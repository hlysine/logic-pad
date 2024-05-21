import GridData from '../grid';
import GridConnections from '../gridConnections';
import Rule from '../rules/rule';
import TileData from '../tile';
import Symbol from '../symbols/symbol';
import Instruction from '../instruction';
import { AnyConfig, ConfigType } from '../config';
import {
  Color,
  Comparison,
  DIRECTIONS,
  Direction,
  DirectionToggle,
  ORIENTATIONS,
  Orientation,
  OrientationToggle,
  directionToggle,
  orientationToggle,
} from '../primitives';
import { array, escape, unescape } from '../dataHelper';
import { allRules } from '../rules';
import { allSymbols } from '../symbols';
import SerializerBase from './serializerBase';
import { Puzzle, PuzzleMetadata } from '../puzzle';
import { ControlLine, Row } from '../rules/musicControlLine';

const OFFSETS = [
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
];

const orientationChars = {
  [Orientation.Up]: 'u',
  [Orientation.UpRight]: 'x',
  [Orientation.Right]: 'r',
  [Orientation.DownRight]: 'z',
  [Orientation.Down]: 'd',
  [Orientation.DownLeft]: 'y',
  [Orientation.Left]: 'l',
  [Orientation.UpLeft]: 'w',
};

export default class SerializerV0 extends SerializerBase {
  public readonly version = 0;

  public stringifyTile(tile: TileData): string {
    if (!tile.exists) return '.';
    const char =
      tile.color === Color.Gray ? 'n' : tile.color === Color.Dark ? 'b' : 'w';
    return tile.fixed ? char.toUpperCase() : char;
  }

  public parseTile(str: string): TileData {
    return TileData.create(str);
  }

  public stringifyControlLine(line: ControlLine): string {
    const result: string[] = [];
    result.push(`c${line.column}`);
    if (line.bpm !== null) result.push(`b${line.bpm}`);
    if (line.pedal !== null) result.push(`p${line.pedal ? '1' : '0'}`);
    if (line.checkpoint) result.push('s');
    result.push(
      `r${line.rows
        .map(row => `v${row.velocity ?? ''}n${row.note ?? ''}`)
        .join(',')}`
    );
    return result.join('|');
  }

  public parseControlLine(str: string): ControlLine {
    let column: number | null = null;
    let bpm: number | null = null;
    let pedal: boolean | null = null;
    let checkpoint = false;
    const rows: Row[] = [];

    const data = str.split('|');
    for (const entry of data) {
      const key = entry.charAt(0);
      const value = entry.slice(1);
      switch (key) {
        case 'c':
          column = value === '' ? null : Number(value);
          break;
        case 'b':
          bpm = value === '' ? null : Number(value);
          break;
        case 'p':
          pedal = value === '1' ? true : value === '0' ? false : null;
          break;
        case 's':
          checkpoint = true;
          break;
        case 'r':
          rows.push(
            ...value.split(',').map(row => {
              const match = row.match(/^v([\d.]*?)n(.*)$/);
              if (!match) return new Row(null, null);
              const [, velocity, note] = match;
              return new Row(
                note === '' ? null : note,
                velocity === '' ? null : Number(velocity)
              );
            })
          );
          break;
      }
    }
    return new ControlLine(column ?? 0, bpm, pedal, checkpoint, rows);
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
      case ConfigType.Direction:
      case ConfigType.Orientation:
        return (
          config.field +
          '=' +
          String(instruction[config.field as keyof Instruction])
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
            : String(instruction[config.field as keyof Instruction]))
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
        );
      case ConfigType.String:
      case ConfigType.Icon:
        return (
          config.field +
          '=' +
          escape(String(instruction[config.field as keyof Instruction]))
        );
      case ConfigType.NullableNote:
        return (
          config.field +
          '=' +
          escape(
            instruction[config.field as keyof Instruction] === null
              ? ''
              : escape(String(instruction[config.field as keyof Instruction]))
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
    }
  }

  public parseConfig(
    configs: readonly AnyConfig[],
    entry: string
  ): [string, unknown] {
    const [key, value] = entry.split('=');
    const config = configs.find(x => x.field === key);
    if (!config) throw new Error(`Unknown config: ${key}`);
    switch (config.type) {
      case ConfigType.Boolean:
        return [config.field, value === '1'];
      case ConfigType.NullableBoolean:
        return [config.field, value === '' ? null : value === '1'];
      case ConfigType.Number:
        return [config.field, Number(value)];
      case ConfigType.NullableNumber:
        return [config.field, value === '' ? null : Number(value)];
      case ConfigType.Color:
        return [config.field, value as Color];
      case ConfigType.Comparison:
        return [config.field, value as Comparison];
      case ConfigType.Direction:
        return [config.field, value as Direction];
      case ConfigType.DirectionToggle: {
        const toggle = directionToggle();
        for (const dir of DIRECTIONS) {
          toggle[dir] = value.includes(orientationChars[dir]);
        }
        return [config.field, toggle];
      }
      case ConfigType.Orientation:
        return [config.field, value as Orientation];
      case ConfigType.OrientationToggle: {
        const toggle = orientationToggle();
        for (const dir of ORIENTATIONS) {
          toggle[dir] = value.includes(orientationChars[dir]);
        }
        return [config.field, toggle];
      }
      case ConfigType.String:
      case ConfigType.Icon:
        return [config.field, unescape(value)];
      case ConfigType.Tile:
      case ConfigType.Grid:
        return [config.field, this.parseGrid(unescape(value))];
      case ConfigType.NullableGrid:
        return [
          config.field,
          value === '' ? null : this.parseGrid(unescape(value)),
        ];
      case ConfigType.ControlLines:
        return [
          config.field,
          unescape(value)
            .split(':')
            .map(line => this.parseControlLine(line)),
        ];
      case ConfigType.NullableNote:
        return [config.field, value === '' ? null : unescape(value)];
    }
  }

  public stringifyInstruction(instruction: Instruction): string {
    return `${instruction.id},${instruction.configs?.map(config => this.stringifyConfig(instruction, config)).join(',') ?? ''}`;
  }

  public stringifyRule(rule: Rule): string {
    return this.stringifyInstruction(rule);
  }

  public stringifySymbol(symbol: Symbol): string {
    return this.stringifyInstruction(symbol);
  }

  public parseRule(str: string): Rule {
    const [id, ...entries] = str.split(',');
    const instruction = allRules.get(id);
    if (!instruction) throw new Error(`Unknown rule: ${id}`);
    const configs = instruction.configs;
    if (configs == null) return instruction.copyWith({});
    return instruction.copyWith(
      Object.fromEntries(
        entries
          .filter(entry => entry !== '')
          .map(entry => this.parseConfig(configs, entry))
      )
    );
  }

  public parseSymbol(str: string): Symbol {
    const [id, ...entries] = str.split(',');
    const instruction = allSymbols.get(id);
    if (!instruction) throw new Error(`Unknown symbol: ${id}`);
    const configs = instruction.configs;
    if (configs == null) return instruction.copyWith({});
    return instruction.copyWith(
      Object.fromEntries(entries.map(entry => this.parseConfig(configs, entry)))
    );
  }

  public stringifyConnections(connections: GridConnections): string {
    const maxX = connections.edges.reduce(
      (max, edge) => Math.max(max, edge.x1, edge.x2),
      0
    );
    const maxY = connections.edges.reduce(
      (max, edge) => Math.max(max, edge.y1, edge.y2),
      0
    );
    const result: string[][] = array(maxX + 1, maxY + 1, () => '.');
    for (let y = 0; y <= maxY; y++) {
      for (let x = 0; x <= maxX; x++) {
        if (result[y][x] !== '.') {
          continue;
        }
        const tiles = connections.getConnectedTiles({ x, y });
        if (tiles.length < 2) {
          continue;
        }
        const existingChars: string[] = [];
        for (const { x: tx, y: ty } of tiles) {
          for (const { x: dx, y: dy } of OFFSETS) {
            if (
              tx + dx > maxX ||
              ty + dy > maxY ||
              tx + dx < 0 ||
              ty + dy < 0
            ) {
              continue;
            }
            if (result[ty + dy][tx + dx] !== '.')
              existingChars.push(result[ty + dy][tx + dx]);
          }
        }
        let char = 'A';
        while (existingChars.includes(char)) {
          char = String.fromCharCode(char.charCodeAt(0) + 1);
        }
        for (const connection of tiles) {
          result[connection.y][connection.x] = char;
        }
      }
    }
    return `C${maxX + 1}:${result.map(row => row.join('')).join('')}`.replace(
      /\.+$/,
      ''
    );
  }

  public parseConnections(input: string): GridConnections {
    if (!input.startsWith('C')) {
      throw new Error('Invalid grid connections\n' + input);
    }
    const [size, data] = input.slice(1).split(':');
    const width = Number(size);
    const tiles = array(
      width,
      Math.ceil(data.length / width),
      (x, y) => data[y * width + x]
    );
    return GridConnections.create(tiles.map(row => row.join('')));
  }

  public stringifyTiles(tiles: readonly (readonly TileData[])[]): string {
    return `T${tiles[0]?.length ?? 0}:${tiles.map(row => row.map(tile => this.stringifyTile(tile)).join('')).join('')}`;
  }

  public parseTiles(input: string): TileData[][] {
    if (!input.startsWith('T')) {
      throw new Error('Invalid grid data\n' + input);
    }
    const [size, data] = input.slice(1).split(':');
    const width = Number(size);
    return array(width, Math.ceil(data.length / width), (x, y) =>
      this.parseTile(data.charAt(y * width + x))
    );
  }

  public stringifyRules(rules: readonly Rule[]): string {
    return `R${rules.map(rule => this.stringifyRule(rule)).join(':')}`;
  }

  public parseRules(input: string): Rule[] {
    if (!input.startsWith('R')) {
      throw new Error('Invalid rules\n' + input);
    }
    return input
      .slice(1)
      .split(':')
      .filter(rule => rule !== '')
      .map(rule => this.parseRule(rule));
  }

  public stringifySymbols(
    symbols: ReadonlyMap<string, readonly Symbol[]>
  ): string {
    return `S${Array.from(symbols.values())
      .flat()
      .map(symbol => this.stringifySymbol(symbol))
      .join(':')}`;
  }

  public parseSymbols(input: string): Map<string, Symbol[]> {
    if (!input.startsWith('S')) {
      throw new Error('Invalid symbols\n' + input);
    }
    const symbols = new Map<string, Symbol[]>();
    input
      .slice(1)
      .split(':')
      .filter(symbol => symbol !== '')
      .forEach(symbol => {
        const parsed = this.parseSymbol(symbol);
        if (symbols.has(parsed.id)) {
          symbols.set(parsed.id, [...symbols.get(parsed.id)!, parsed]);
        } else {
          symbols.set(parsed.id, [parsed]);
        }
      });
    return symbols;
  }

  public stringifyGrid(grid: GridData): string {
    const data = [
      this.stringifyTiles(grid.tiles),
      this.stringifyConnections(grid.connections),
      this.stringifySymbols(grid.symbols),
      this.stringifyRules(grid.rules),
    ];
    return `${grid.width}x${grid.height}|${data.join('|')}`;
  }

  public parseGrid(input: string): GridData {
    const data = input.split('|');
    let width: number | undefined;
    let height: number | undefined;
    let tiles: TileData[][] | undefined;
    let connections: GridConnections | undefined;
    let symbols: Map<string, Symbol[]> | undefined;
    let rules: Rule[] | undefined;
    for (const d of data) {
      if (/^\d+x\d+$/.test(d)) {
        [width, height] = d.split('x').map(Number);
      } else if (d.startsWith('T')) {
        tiles = this.parseTiles(d);
      } else if (d.startsWith('C')) {
        connections = this.parseConnections(d);
      } else if (d.startsWith('S')) {
        symbols = this.parseSymbols(d);
      } else if (d.startsWith('R')) {
        rules = this.parseRules(d);
      } else {
        throw new Error(`Invalid data: ${d}`);
      }
    }
    return new GridData(
      width ?? tiles?.[0].length ?? 0,
      height ?? tiles?.length ?? 0,
      tiles,
      connections,
      symbols,
      rules
    );
  }

  public stringifyPuzzle(puzzle: Puzzle): string {
    let grid = puzzle.grid;
    if (puzzle.solution !== null) {
      const tiles = array(puzzle.grid.width, puzzle.grid.height, (x, y) => {
        const tile = puzzle.grid.getTile(x, y);
        const solutionTile = puzzle.solution!.getTile(x, y);
        return tile.exists &&
          !tile.fixed &&
          solutionTile.exists &&
          solutionTile.color !== Color.Gray
          ? tile.copyWith({
              color: puzzle.solution!.tiles[y][x].color,
            })
          : tile;
      });
      grid = puzzle.grid.copyWith({ tiles });
    }
    return JSON.stringify({
      title: puzzle.title,
      grid: this.stringifyGrid(grid),
      difficulty: puzzle.difficulty,
      link: puzzle.link,
      author: puzzle.author,
      description: puzzle.description,
    });
  }

  public parsePuzzle(input: string): Puzzle {
    const { grid: gridString, ...metadata } = JSON.parse(
      input
    ) as PuzzleMetadata & { grid: string };
    const grid = this.parseGrid(gridString);
    const reset = grid.resetTiles();
    return {
      ...metadata,
      grid: reset,
      solution: grid.colorEquals(reset) ? null : grid,
    };
  }
}
