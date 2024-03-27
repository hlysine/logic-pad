import GridData from './grid';
import GridConnections from './gridConnections';
import Rule from './rules/rule';
import TileData from './tile';
import Symbol from './symbols/symbol';
import Instruction from './instruction';
import { AnyConfig, ConfigType } from './config';
import { Color, Direction, Edge } from './primitives';
import { array, escape, unescape } from './helper';
import allRules from '../allRules';
import allSymbols from '../allSymbols';

const OFFSETS = [
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
];

const Serializer = {
  stringifyTile(tile: TileData): string {
    if (!tile.exists) return '.';
    const char =
      tile.color === Color.Gray ? 'n' : tile.color === Color.Dark ? 'b' : 'w';
    return tile.fixed ? char.toUpperCase() : char;
  },
  parseTile(str: string): TileData {
    return TileData.create(str);
  },

  stringifyConfig(instruction: Instruction, config: AnyConfig): string {
    switch (config.type) {
      case ConfigType.Number:
      case ConfigType.Color:
      case ConfigType.Direction:
        return (
          config.field +
          '=' +
          String(instruction[config.field as keyof Instruction])
        );

      case ConfigType.String:
        return (
          config.field +
          '=' +
          escape(String(instruction[config.field as keyof Instruction]))
        );
      case ConfigType.Grid:
        return (
          config.field +
          '=' +
          escape(
            this.stringifyTiles(
              (
                instruction[
                  config.field as keyof Instruction
                ] as unknown as GridData
              ).tiles
            )
          )
        );
    }
  },
  parseConfig(configs: readonly AnyConfig[], entry: string): [string, unknown] {
    const [key, value] = entry.split('=');
    const config = configs.find(x => x.field === key);
    if (!config) throw new Error(`Unknown config: ${key}`);
    switch (config.type) {
      case ConfigType.Number:
        return [config.field, Number(value)];
      case ConfigType.Color:
        return [config.field, value as Color];
      case ConfigType.Direction:
        return [config.field, value as Direction];
      case ConfigType.String:
        return [config.field, unescape(value)];
      case ConfigType.Grid: {
        const tiles = this.parseTiles(unescape(value));
        return [
          config.field,
          new GridData(tiles[0].length, tiles.length, tiles),
        ];
      }
    }
  },

  stringifyInstruction(instruction: Instruction): string {
    return `${instruction.id},${instruction.configs?.map(config => this.stringifyConfig(instruction, config)).join(',') ?? ''}`;
  },
  stringifyRule(rule: Rule): string {
    return this.stringifyInstruction(rule);
  },
  stringifySymbol(symbol: Symbol): string {
    return this.stringifyInstruction(symbol);
  },
  parseRule(str: string): Rule {
    const [id, ...entries] = str.split(',');
    const instruction = allRules.get(id);
    if (!instruction) throw new Error(`Unknown symbol: ${id}`);
    const configs = instruction.configs;
    if (configs == null) return instruction.copyWith({});
    return instruction.copyWith(
      Object.fromEntries(
        entries
          .filter(entry => entry !== '')
          .map(entry => this.parseConfig(configs, entry))
      )
    );
  },
  parseSymbol(str: string): Symbol {
    const [id, ...entries] = str.split(',');
    const instruction = allSymbols.get(id);
    if (!instruction) throw new Error(`Unknown symbol: ${id}`);
    const configs = instruction.prototype.configs;
    if (configs == null) return instruction.prototype.copyWith({});
    return instruction.prototype.copyWith(
      Object.fromEntries(entries.map(entry => this.parseConfig(configs, entry)))
    );
  },

  stringifyConnections(connections: GridConnections): string {
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
        for (const { x: dx, y: dy } of OFFSETS) {
          if (x + dx > maxX || y + dy > maxY || x + dx < 0 || y + dy < 0) {
            continue;
          }
          if (result[y + dy][x + dx] !== '.')
            existingChars.push(result[y + dy][x + dx]);
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
  },
  parseConnections(input: string): GridConnections {
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
    const result: Edge[] = [];
    for (let y = 0; y < tiles.length; y++) {
      for (let x = 0; x < width; x++) {
        if (tiles[y][x] === '.') {
          continue;
        }
        if (x > 0 && tiles[y][x - 1] === tiles[y][x]) {
          result.push({ x1: x - 1, y1: y, x2: x, y2: y });
        }
        if (y > 0 && tiles[y - 1][x] === tiles[y][x]) {
          result.push({ x1: x, y1: y - 1, x2: x, y2: y });
        }
      }
    }
    return new GridConnections(result);
  },

  stringifyTiles(tiles: readonly (readonly TileData[])[]): string {
    return `T${tiles[0]?.length ?? 0}:${tiles.map(row => row.map(tile => this.stringifyTile(tile)).join('')).join('')}`;
  },
  parseTiles(input: string): TileData[][] {
    if (!input.startsWith('T')) {
      throw new Error('Invalid grid data\n' + input);
    }
    const [size, data] = input.slice(1).split(':');
    const width = Number(size);
    return array(width, Math.ceil(data.length / width), (x, y) =>
      this.parseTile(data.charAt(y * width + x))
    );
  },

  stringifyRules(rules: readonly Rule[]): string {
    return `R${rules.map(rule => this.stringifyRule(rule)).join(':')}`;
  },
  parseRules(input: string): Rule[] {
    if (!input.startsWith('R')) {
      throw new Error('Invalid rules\n' + input);
    }
    return input
      .slice(1)
      .split(':')
      .filter(rule => rule !== '')
      .map(rule => this.parseRule(rule));
  },

  stringifySymbols(symbols: ReadonlyMap<string, readonly Symbol[]>): string {
    return `S${Array.from(symbols.values())
      .flat()
      .map(symbol => this.stringifySymbol(symbol))
      .join(':')}`;
  },
  parseSymbols(input: string): Map<string, Symbol[]> {
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
  },

  stringifyGrid(grid: GridData): string {
    const data = [
      this.stringifyTiles(grid.tiles),
      this.stringifyConnections(grid.connections),
      this.stringifySymbols(grid.symbols),
      this.stringifyRules(grid.rules),
    ];
    return `${grid.width}x${grid.height}|${data.join('|')}`;
  },
  parseGrid(input: string): GridData {
    const [size, ...data] = input.split('|');
    const [width, height] = size.split('x').map(Number);
    let tiles: TileData[][] | undefined;
    let connections: GridConnections | undefined;
    let symbols: Map<string, Symbol[]> | undefined;
    let rules: Rule[] | undefined;
    for (const d of data) {
      if (d.startsWith('T')) {
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
    return new GridData(width, height, tiles, connections, symbols, rules);
  },
};

export default Serializer;
