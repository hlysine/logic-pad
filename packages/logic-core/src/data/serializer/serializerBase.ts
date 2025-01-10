import GridData from '../grid.js';
import GridConnections from '../gridConnections.js';
import Rule from '../rules/rule.js';
import TileData from '../tile.js';
import Symbol from '../symbols/symbol.js';
import { Puzzle } from '../puzzle.js';

export default abstract class SerializerBase {
  public abstract get version(): number;
  public abstract stringifyTile(tile: TileData): string;
  public abstract parseTile(str: string): TileData;
  public abstract stringifyRule(rule: Rule): string;
  public abstract stringifySymbol(symbol: Symbol): string;
  public abstract parseRule(str: string): Rule;
  public abstract parseSymbol(str: string): Symbol;
  public abstract stringifyConnections(connections: GridConnections): string;
  public abstract parseConnections(input: string): GridConnections;
  public abstract stringifyTiles(
    tiles: readonly (readonly TileData[])[]
  ): string;

  public abstract parseTiles(input: string): TileData[][];
  public abstract stringifyRules(rules: readonly Rule[]): string;
  public abstract parseRules(input: string): Rule[];
  public abstract stringifySymbols(
    symbols: ReadonlyMap<string, readonly Symbol[]>
  ): string;

  public abstract parseSymbols(input: string): Map<string, Symbol[]>;
  public abstract stringifyGrid(grid: GridData): string;
  public abstract parseGrid(input: string): GridData;
  public abstract stringifyPuzzle(puzzle: Puzzle): string;
  public abstract parsePuzzle(input: string): Puzzle;
}
