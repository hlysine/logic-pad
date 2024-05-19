import { Comparison, Position } from '../../../primitives';
import SymbolsPerRegionRule from '../../../rules/symbolsPerRegionRule';
import Symbol from '../../../symbols/symbol';
import BTModule, {
  BTGridData,
  BTTile,
  CheckResult,
  IntArray2D,
  colorToBTTile,
} from '../data';

export default class SymbolsPerRegionBTModule extends BTModule {
  public instr: SymbolsPerRegionRule;

  private symbolCount: IntArray2D;

  public constructor(
    instr: SymbolsPerRegionRule,
    width: number,
    height: number,
    allSymbols: Symbol[]
  ) {
    super();
    this.instr = instr;

    this.symbolCount = IntArray2D.create(width, height);

    for (const symbol of allSymbols) {
      const symbolX = Math.floor(symbol.x);
      const symbolY = Math.floor(symbol.y);

      this.symbolCount.set(
        symbolX,
        symbolY,
        this.symbolCount.get(symbolX, symbolY) + 1
      );
    }
  }

  public checkGlobal(grid: BTGridData): CheckResult | false {
    const color = colorToBTTile(this.instr.color);

    const visited: IntArray2D = IntArray2D.create(grid.width, grid.height);

    let id = 0;

    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        if (visited.get(x, y) & 0b01111111) continue;
        if (grid.getTile(x, y) !== color) continue;

        id += 1;
        if (id > 127) throw new Error('Too many regions!');

        if (!this.visitArea(grid, color, visited, { x, y }, id)) return false;
      }
    }

    return { tilesNeedCheck: null, ratings: null };
  }

  private visitArea(
    grid: BTGridData,
    tile: BTTile,
    visited: IntArray2D,
    pos: Position,
    id: number
  ) {
    const sameTileQueue: Position[] = [pos];
    const usableTileQueue: Position[] = [];

    let completed = 0;
    let possible = 0;

    visited.set(pos.x, pos.y, id);

    // Count same tile
    while (sameTileQueue.length > 0) {
      const curPos = sameTileQueue.pop()!;

      completed += this.symbolCount.get(curPos.x, curPos.y);

      for (const edge of grid.getEdges(curPos)) {
        if ((visited.get(edge.x, edge.y) & 0b01111111) === id) continue;

        const edgeTile = grid.getTile(edge.x, edge.y);

        if (edgeTile === BTTile.Empty) {
          usableTileQueue.push(edge);
          visited.set(edge.x, edge.y, id | 0b10000000);
        } else if (edgeTile === tile) {
          sameTileQueue.push(edge);
          visited.set(edge.x, edge.y, id);
        }
      }
    }

    if (completed > this.instr.count) {
      return this.instr.comparison === Comparison.AtLeast;
    }

    if (this.instr.comparison === Comparison.AtMost) return true;

    // Count usable tile
    while (usableTileQueue.length > 0) {
      const curPos = usableTileQueue.pop()!;

      possible += this.symbolCount.get(curPos.x, curPos.y);

      if (completed + possible >= this.instr.count) return true;

      for (const edge of grid.getEdges(curPos)) {
        if ((visited.get(edge.x, edge.y) & 0b01111111) === id) continue;

        const edgeTile = grid.getTile(edge.x, edge.y);

        if (edgeTile === BTTile.Empty || edgeTile === tile) {
          usableTileQueue.push(edge);
          visited.set(edge.x, edge.y, id | 0b10000000);
        }
      }
    }

    return completed + possible >= this.instr.count;
  }
}
