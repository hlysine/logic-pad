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

  /**
   * Create a new grid with tiles, connections, symbols and rules.
   * @param width The width of the grid.
   * @param height The height of the grid.
   * @param tiles The tiles of the grid.
   * @param connections The connections of the grid, which determines which tiles are merged.
   * @param symbols The symbols in the grid.
   * @param rules The rules of the grid.
   */
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

  /**
   * Copy the current grid while modifying the provided properties.
   * @param param0 The properties to modify.
   * @returns The new grid with the modified properties.
   */
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

  public isPositionValid(x: number, y: number) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /**
   * Safely get the tile at the given position.
   * @param x The x-coordinate of the tile.
   * @param y The y-coordinate of the tile.
   * @returns The tile at the given position, or a non-existent tile if the position is invalid.
   */
  public getTile(x: number, y: number): TileData {
    if (!this.isPositionValid(x, y)) return TileData.doesNotExist();
    return this.tiles[y][x];
  }

  /**
   * Safely set the tile at the given position.
   * If the position is invalid, the grid is returned unchanged.
   * If the tile is merged with other tiles, the colors of all connected tiles are changed.
   *
   * @param x The x-coordinate of the tile.
   * @param y The y-coordinate of the tile.
   * @param tile The new tile to set.
   * @returns The new grid with the tile set at the given position.
   */
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

  /**
   * Add or modify the connections in the grid.
   * @param connections The new connections to add or modify.
   * @returns The new grid with the new connections.
   */
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

  /**
   * Add or modify the symbols in the grid.
   * @param symbols The new symbols to add or modify.
   * @returns The new grid with the new symbols.
   */
  public withSymbols(
    symbols:
      | readonly Symbol[]
      | ReadonlyMap<string, readonly Symbol[]>
      | ((
          value: Map<string, readonly Symbol[]>
        ) => ReadonlyMap<string, readonly Symbol[]>)
  ): GridData {
    if (symbols instanceof Array) {
      const map = new Map<string, Symbol[]>();
      for (const symbol of symbols) {
        if (map.has(symbol.id)) {
          map.set(symbol.id, [...map.get(symbol.id)!, symbol]);
        } else {
          map.set(symbol.id, [symbol]);
        }
      }
      return this.copyWith({ symbols: map });
    }
    return this.copyWith({
      symbols:
        typeof symbols === 'function'
          ? symbols(new Map(this.symbols))
          : symbols,
    });
  }

  /**
   * Add a new symbol to the grid.
   * @param symbol The symbol to add.
   * @returns The new grid with the new symbol.
   */
  public addSymbol(symbol: Symbol): GridData {
    return this.withSymbols(map => {
      if (map.has(symbol.id)) {
        return map.set(symbol.id, [...map.get(symbol.id)!, symbol]);
      } else {
        return map.set(symbol.id, [symbol]);
      }
    });
  }

  /**
   * Remove an instance of the symbol from the grid.
   * @param symbol The symbol to remove.
   * @returns The new grid with the symbol removed.
   */
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

  /**
   * Add or modify the rules in the grid.
   * @param rules The new rules to add or modify.
   * @returns The new grid with the new rules.
   */
  public withRules(
    rules: readonly Rule[] | ((value: readonly Rule[]) => readonly Rule[])
  ): GridData {
    return this.copyWith({
      rules: typeof rules === 'function' ? rules(this.rules) : rules,
    });
  }

  /**
   * Add a new rule to the grid.
   * @param rule The rule to add.
   * @returns The new grid with the new rule.
   */
  public addRule(rule: Rule): GridData {
    return this.withRules(rules => [...rules, rule]);
  }

  /**
   * Remove an instance of the rule from the grid.
   * @param rule The rule to remove.
   * @returns The new grid with the rule removed.
   */
  public removeRule(rule: Rule): GridData {
    return this.withRules(rules => rules.filter(r => r !== rule));
  }

  /**
   * Replace an existing rule with a new rule.
   * @param oldRule The rule to replace.
   * @param newRule The new rule to replace with.
   * @returns The new grid with the rule replaced.
   */
  public replaceRule(oldRule: Rule, newRule: Rule): GridData {
    return this.withRules(rules =>
      rules.map(r => (r === oldRule ? newRule : r))
    );
  }

  /**
   * Resize the grid to the new width and height. Common tiles are kept, and new tiles are empty.
   * @param width The new width of the grid.
   * @param height The new height of the grid.
   * @returns The new grid with the new dimensions.
   */
  public resize(width: number, height: number): GridData {
    const newGrid = new GridData(width, height, undefined, this.connections);
    for (let y = 0; y < Math.min(this.height, height); y++) {
      for (let x = 0; x < Math.min(this.width, width); x++) {
        newGrid.setTile(x, y, this.getTile(x, y));
      }
    }
    return newGrid;
  }

  /**
   * Create a new GridData object from a string array.
   *
   * - Use `b` for dark cells, `w` for light cells, and `n` for gray cells.
   * - Capitalize the letter to make the tile fixed.
   * - Use `.` to represent empty space.
   *
   * @param array - The string array to create the grid from.
   * @returns The created grid.
   */
  public static create(array: string[]): GridData {
    const height = array.length;
    const width = array.reduce((max, row) => Math.max(max, row.length), 0);
    const tiles = array.map(row =>
      Array.from({ length: width }, (_, x) => {
        return TileData.create(row.charAt(x));
      })
    );
    return new GridData(width, height, tiles);
  }

  /**
   * Find a tile in the grid that satisfies the predicate.
   *
   * @param predicate The predicate to test each tile with.
   * @returns The position of the first tile that satisfies the predicate, or undefined if no tile is found.
   */
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

  /**
   * Iterate over all tiles in the same region as the given position that satisfy the predicate.
   * The iteration stops when the callback returns a value that is not undefined.
   * Non-existent tiles are not included in the iteration.
   *
   * @param position The position to start the iteration from. This position is included in the iteration.
   * @param predicate The predicate to test each tile with. The callback is only called for tiles that satisfy this predicate.
   * @param callback The callback to call for each tile that satisfies the predicate. The iteration stops when this callback returns a value that is not undefined.
   * @returns The value returned by the callback that stopped the iteration, or undefined if the iteration completed.
   */
  public iterateArea<T>(
    position: Position,
    predicate: (tile: TileData) => boolean,
    callback: (tile: TileData, x: number, y: number) => undefined | T
  ): T | undefined {
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
      const ret = callback(this.getTile(x, y), x, y);
      if (ret !== undefined) return ret;
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

  /**
   * Iterate over all tiles in a straight line from the given position in the given direction that satisfy the predicate.
   * The iteration stops when the callback returns a value that is not undefined.
   * Non-existent tiles break the iteration.
   *
   * @param position The position to start the iteration from. This position is included in the iteration.
   * @param direction The direction to iterate in.
   * @param predicate The predicate to test each tile with. The callback is only called for tiles that satisfy this predicate.
   * @param callback The callback to call for each tile that satisfies the predicate. The iteration stops when this callback returns a value that is not undefined.
   * @returns The value returned by the callback that stopped the iteration, or undefined if the iteration completed.
   */
  public iterateDirection<T>(
    position: Position,
    direction: Direction,
    predicate: (tile: TileData) => boolean,
    callback: (tile: TileData, x: number, y: number) => T | undefined
  ): T | undefined {
    return this.iterateDirectionAll(
      position,
      direction,
      tile => tile.exists && predicate(tile),
      callback
    );
  }

  /**
   * Iterate over all tiles in a straight line from the given position in the given direction that satisfy the predicate.
   * The iteration stops when the callback returns a value that is not undefined.
   * Non-existent tiles are included in the iteration.
   *
   * @param position The position to start the iteration from. This position is included in the iteration.
   * @param direction The direction to iterate in.
   * @param predicate The predicate to test each tile with. The callback is only called for tiles that satisfy this predicate.
   * @param callback The callback to call for each tile that satisfies the predicate. The iteration stops when this callback returns a value that is not undefined.
   * @returns The value returned by the callback that stopped the iteration, or undefined if the iteration completed.
   */
  public iterateDirectionAll<T>(
    position: Position,
    direction: Direction,
    predicate: (tile: TileData) => boolean,
    callback: (tile: TileData, x: number, y: number) => T | undefined
  ): T | undefined {
    let current = position;
    while (this.isPositionValid(current.x, current.y)) {
      const tile = this.getTile(current.x, current.y);
      if (!predicate(tile)) {
        break;
      }
      const ret = callback(tile, current.x, current.y);
      if (ret !== undefined) return ret;
      current = move(current, direction);
    }
  }

  /**
   * Check if every tile in the grid is filled with a color other than gray.
   *
   * @returns True if every tile is filled with a color other than gray, false otherwise.
   */
  public isComplete(): boolean {
    return this.tiles.every(row =>
      row.every(tile => !tile.exists || tile.color !== Color.Gray)
    );
  }

  /**
   * Iterate over all tiles in the grid.
   * The iteration stops when the callback returns a value that is not undefined.
   *
   * @param callback The callback to call for each tile.
   * @returns The value returned by the callback that stopped the iteration, or undefined if the iteration completed.
   */
  public forEach<T>(
    callback: (tile: TileData, x: number, y: number) => T | undefined
  ): T | undefined {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const ret = callback(this.getTile(x, y), x, y);
        if (ret !== undefined) return ret;
      }
    }
  }

  /**
   * Flood fill a continuous region starting from the given position with the given color.
   *
   * @param position The position to start the flood fill from.
   * @param from The color of the tiles to fill.
   * @param to The color to fill the tiles with.
   * @returns The new grid with the region filled with the new color.
   */
  public floodFill(position: Position, from: Color, to: Color): GridData {
    const tiles = array(this.width, this.height, (x, y) => this.getTile(x, y));
    this.iterateArea(
      position,
      t => t.color === from,
      (tile, x, y) => {
        tiles[y][x] = tile.withColor(to);
      }
    );
    return this.copyWith({ tiles });
  }

  /**
   * Flood fill all tiles with the given color to a new color, even if they are not connected.
   *
   * @param from The color of the tiles to fill.
   * @param to The color to fill the tiles with.
   * @returns The new grid with all tiles filled with the new color.
   */
  public floodFillAll(from: Color, to: Color): GridData {
    return this.copyWith({
      tiles: this.tiles.map(row =>
        row.map(tile => (tile.color === from ? tile.withColor(to) : tile))
      ),
    });
  }

  /**
   * Reset all non-fixed tiles to gray.
   *
   * @returns The new grid with all non-fixed tiles reset to gray.
   */
  public resetTiles(): GridData {
    let changed = false;
    const newTiles = array(this.width, this.height, (x, y) => {
      const tile = this.getTile(x, y);
      if (tile.exists && !tile.fixed && tile.color !== Color.Gray) {
        changed = true;
        return tile.withColor(Color.Gray);
      }
      return tile;
    });
    if (!changed) return this;
    return this.copyWith({ tiles: newTiles });
  }

  /**
   * Copy the tiles in the given region to a new grid.
   *
   * @param origin The top-left corner of the region to copy.
   * @param width The width of the region to copy.
   * @param height The height of the region to copy.
   * @returns The new grid with the copied tiles.
   */
  public copyTiles(origin: Position, width: number, height: number): GridData {
    const newTiles = array(width, height, (x, y) =>
      this.getTile(origin.x + x, origin.y + y)
    );
    return new GridData(width, height, newTiles);
  }

  /**
   * Paste the tiles from the given grid to the current grid at the given position.
   * @param origin The top-left corner of the region to paste the tiles to.
   * @param grid The grid to paste the tiles from.
   * @returns The new grid with the pasted tiles.
   */
  public pasteTiles(origin: Position, grid: GridData): GridData {
    const newTiles = this.tiles.map(row => [...row]);
    grid.forEach((tile, x, y) => {
      if (this.isPositionValid(origin.x + x, origin.y + y))
        newTiles[origin.y + y][origin.x + x] = tile;
    });
    return this.copyWith({ tiles: newTiles });
  }
}
