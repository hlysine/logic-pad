import GridConnections from './gridConnections';
import Symbol from './symbols/symbol';
import TileData from './tile';

export default class GridData {
  public readonly tiles: readonly (readonly TileData[])[];
  public readonly connections: GridConnections;
  public readonly symbols: readonly Symbol[];

  public constructor(
    public readonly width: number,
    public readonly height: number,
    tiles?: readonly (readonly TileData[])[],
    connections?: GridConnections,
    symbols?: readonly Symbol[]
  ) {
    this.width = width;
    this.height = height;
    this.tiles =
      tiles ??
      Array.from({ length: height }, () =>
        Array.from({ length: width }, () => TileData.empty())
      );
    this.connections = connections ?? new GridConnections();
    this.symbols = symbols ?? [];
  }

  public copyWith({
    width,
    height,
    tiles,
    connections,
    symbols,
  }: {
    width?: number;
    height?: number;
    tiles?: readonly (readonly TileData[])[];
    connections?: GridConnections;
    symbols?: readonly Symbol[];
  }): GridData {
    return new GridData(
      width ?? this.width,
      height ?? this.height,
      tiles ?? this.tiles,
      connections ?? this.connections,
      symbols ?? this.symbols
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
      | readonly Symbol[]
      | ((value: readonly Symbol[]) => readonly Symbol[])
  ): GridData {
    return this.copyWith({
      symbols: typeof symbols === 'function' ? symbols(this.symbols) : symbols,
    });
  }

  public addSymbol(symbol: Symbol): GridData {
    return this.withSymbols(symbols => [...symbols, symbol]);
  }

  public removeSymbol(symbol: string): GridData {
    return this.withSymbols(symbols => symbols.filter(s => s.id !== symbol));
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
}
