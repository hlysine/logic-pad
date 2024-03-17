import GridConnections from './gridConnections';
import { array, move } from './helper';
import { Color, Direction, Position } from './primitives';
import Rule from './rules/rule';
import Symbol from './symbols/symbol';
import TileData from './tile';

const NEIGHBOR_OFFSETS: Position[] = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
];

export default class GridData {
  public readonly tiles: readonly (readonly TileData[])[];
  public readonly connections: GridConnections;
  public readonly symbols: ReadonlyMap<string, readonly Symbol[]>;
  public readonly rules: readonly Rule[];

  public constructor(
    public readonly width: number,
    public readonly height: number,
    tiles?: readonly (readonly TileData[])[],
    connections?: GridConnections,
    symbols?: ReadonlyMap<string, readonly Symbol[]>,
    rules?: readonly Rule[]
  ) {
    this.width = width;
    this.height = height;
    this.tiles = tiles ?? array(width, height, () => TileData.empty());
    this.connections = connections ?? new GridConnections();
    this.symbols = symbols ?? new Map();
    this.rules = rules ?? [];
  }

  public copyWith({
    width,
    height,
    tiles,
    connections,
    symbols,
    rules,
  }: {
    width?: number;
    height?: number;
    tiles?: readonly (readonly TileData[])[];
    connections?: GridConnections;
    symbols?: ReadonlyMap<string, readonly Symbol[]>;
    rules?: readonly Rule[];
  }): GridData {
    return new GridData(
      width ?? this.width,
      height ?? this.height,
      tiles ?? this.tiles,
      connections ?? this.connections,
      symbols ?? this.symbols,
      rules ?? this.rules
    );
  }

  public getTile(x: number, y: number): TileData {
    return this.tiles[y][x];
  }

  public setTile(x: number, y: number, tile: TileData): GridData;
  public setTile(
    x: number,
    y: number,
    transform: (tile: TileData) => TileData
  ): GridData;

  public setTile(
    x: number,
    y: number,
    tile: TileData | ((tile: TileData) => TileData)
  ): GridData {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return this;
    }

    const changing = this.connections.getConnectedTiles({ x, y });
    const tiles = this.tiles.map(row => [...row]);
    const newTile = typeof tile === 'function' ? tile(tiles[y][x]) : tile;

    changing.forEach(({ x, y }) => {
      tiles[y][x] = tiles[y][x].withColor(newTile.color);
    });
    tiles[y][x] = newTile;

    return this.copyWith({ tiles });
  }

  public withConnections(
    connections: GridConnections | ((value: GridConnections) => GridConnections)
  ): GridData {
    return this.copyWith({
      connections:
        typeof connections === 'function'
          ? connections(this.connections)
          : connections,
    });
  }

  public withSymbols(
    symbols:
      | ReadonlyMap<string, readonly Symbol[]>
      | ((
          value: Map<string, readonly Symbol[]>
        ) => ReadonlyMap<string, readonly Symbol[]>)
  ): GridData {
    return this.copyWith({
      symbols:
        typeof symbols === 'function'
          ? symbols(new Map(this.symbols))
          : symbols,
    });
  }

  public addSymbol(symbol: Symbol): GridData {
    return this.withSymbols(map => {
      if (map.has(symbol.id)) {
        return map.set(symbol.id, [...map.get(symbol.id)!, symbol]);
      } else {
        return map.set(symbol.id, [symbol]);
      }
    });
  }

  public removeSymbol(symbol: Symbol): GridData {
    return this.withSymbols(map => {
      if (map.has(symbol.id)) {
        const symbols = map.get(symbol.id)!.filter(s => s !== symbol);
        if (symbols.length === 0) {
          map.delete(symbol.id);
        } else {
          map.set(symbol.id, symbols);
        }
      }
      return map;
    });
  }

  public withRules(
    rules: readonly Rule[] | ((value: readonly Rule[]) => readonly Rule[])
  ): GridData {
    return this.copyWith({
      rules: typeof rules === 'function' ? rules(this.rules) : rules,
    });
  }

  public addRule(rule: Rule): GridData {
    return this.withRules(rules => [...rules, rule]);
  }

  public removeRule(rule: string): GridData {
    return this.withRules(rules => rules.filter(r => r.id !== rule));
  }

  public resize(width: number, height: number): GridData {
    const newGrid = new GridData(width, height, undefined, this.connections);
    for (let y = 0; y < Math.min(this.height, height); y++) {
      for (let x = 0; x < Math.min(this.width, width); x++) {
        newGrid.setTile(x, y, this.getTile(x, y));
      }
    }
    return newGrid;
  }

  public static create(array: string[]): GridData {
    const height = array.length;
    const width = array.reduce((max, row) => Math.max(max, row.length), 0);
    const tiles = array.map(row =>
      Array.from({ length: width }, (_, x) => {
        const char = row.charAt(x);
        const lower = char.toLowerCase();
        return new TileData(
          char !== '.',
          char !== lower,
          lower === 'w' ? Color.Light : lower === 'b' ? Color.Dark : Color.Gray
        );
      })
    );
    return new GridData(width, height, tiles);
  }

  public find(
    predicate: (tile: TileData, x: number, y: number) => boolean
  ): Position | undefined {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (predicate(this.getTile(x, y), x, y)) {
          return { x, y };
        }
      }
    }
    return undefined;
  }

  public iterateArea(
    position: Position,
    predicate: (tile: TileData) => boolean,
    callback: (tile: TileData, x: number, y: number) => void
  ): void {
    const tile = this.getTile(position.x, position.y);
    if (!tile.exists || !predicate(tile)) {
      return;
    }
    const visited = new Set<string>();
    const stack = [position];
    while (stack.length > 0) {
      const { x, y } = stack.pop()!;
      const key = `${x},${y}`;
      if (visited.has(key)) {
        continue;
      }
      visited.add(key);
      callback(this.getTile(x, y), x, y);
      for (const offset of NEIGHBOR_OFFSETS) {
        const next = { x: x + offset.x, y: y + offset.y };
        if (
          next.x >= 0 &&
          next.x < this.width &&
          next.y >= 0 &&
          next.y < this.height
        ) {
          const nextTile = this.getTile(next.x, next.y);
          if (nextTile.exists && predicate(nextTile)) stack.push(next);
        }
      }
    }
  }

  public iterateDirection(
    position: Position,
    direction: Direction,
    predicate: (tile: TileData) => boolean,
    callback: (tile: TileData, x: number, y: number) => void
  ): void {
    let current = position;
    while (
      current.x >= 0 &&
      current.x < this.width &&
      current.y >= 0 &&
      current.y < this.height
    ) {
      const tile = this.getTile(current.x, current.y);
      if (!tile.exists || !predicate(tile)) {
        break;
      }
      callback(tile, current.x, current.y);
      current = move(current, direction);
    }
  }

  public isComplete(): boolean {
    return this.tiles.every(row =>
      row.every(tile => !tile.exists || tile.color !== Color.Gray)
    );
  }

  public forEach(
    callback: (tile: TileData, x: number, y: number) => void
  ): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        callback(this.getTile(x, y), x, y);
      }
    }
  }
}
