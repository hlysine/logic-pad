import GalaxySymbol, {
  instance as galaxyInstance,
} from '../../../symbols/galaxySymbol';
import LotusSymbol from '../../../symbols/lotusSymbol';
import { Orientation, Position } from '../../../primitives';
import DirectionLinkerSymbol from '../../../symbols/directionLinkerSymbol';
import BTModule, {
  BTGridData,
  BTTile,
  CheckResult,
  IntArray2D,
  Rating,
  createOneTileResult,
} from '../data';

export default class DirectionLinkerBTModule extends BTModule {
  public instr: DirectionLinkerSymbol;

  public constructor(instr: DirectionLinkerSymbol) {
    super();
    this.instr = instr;
  }

  public checkGlobal(grid: BTGridData): CheckResult | false {
    const tile = grid.getTile(this.instr.x, this.instr.y);

    if (tile === BTTile.Empty)
      return createOneTileResult(grid, { x: this.instr.x, y: this.instr.y });

    const tilesNeedCheck = IntArray2D.create(grid.width, grid.height);
    const ratings: Rating[] = [];

    const queue: Position[] = [{ x: this.instr.x, y: this.instr.y }];
    const visited = IntArray2D.create(grid.width, grid.height);

    // Visit all connected tiles
    while (queue.length > 0) {
      const curPos = queue.pop()!;

      if (visited.get(curPos.x, curPos.y)) continue;
      visited.set(curPos.x, curPos.y, 1);

      const oppoPos = this.movePos(grid, curPos.x, curPos.y);
      if (oppoPos === null) return false;

      const oppoTile = grid.getTile(oppoPos.x, oppoPos.y);
      if (!(oppoTile === BTTile.Empty || oppoTile === tile)) return false;

      for (const edge of grid.getEdges(curPos)) {
        if (visited.get(edge.x, edge.y)) continue;

        const edgeTile = grid.getTile(edge.x, edge.y);
        if (edgeTile === BTTile.Empty) {
          tilesNeedCheck.set(edge.x, edge.y, 1);
          ratings.push({ pos: edge, score: 1 });
        } else if (edgeTile === tile) {
          queue.push(edge);
        }
      }
    }

    return { tilesNeedCheck, ratings };
  }

  public checkLocal(grid: BTGridData, _: Position[]): CheckResult | false {
    return this.checkGlobal(grid);
  }

  private movePos(grid: BTGridData, x: number, y: number): Position | null {
    if (this.instr.id === galaxyInstance.id) {
      return this.movePosGalaxy(grid, x, y);
    } else {
      return this.movePosLotus(grid, x, y);
    }
  }

  // Translate a position in relative to a galaxy symbol
  private movePosGalaxy(
    grid: BTGridData,
    x: number,
    y: number
  ): Position | null {
    const symbol = this.instr as GalaxySymbol;

    const pos = { x: 2 * symbol.x - x, y: 2 * symbol.y - y };
    return grid.isInBound(pos.x, pos.y) ? pos : null;
  }

  // Translate a position in relative to a lotus symbol
  private movePosLotus(
    grid: BTGridData,
    x: number,
    y: number
  ): Position | null {
    const symbol = this.instr as LotusSymbol;

    let pos!: Position;
    if (
      symbol.orientation === Orientation.Up ||
      symbol.orientation === Orientation.Down
    ) {
      pos = { x: 2 * symbol.x - x, y };
    } else if (
      symbol.orientation === Orientation.UpRight ||
      symbol.orientation === Orientation.DownLeft
    ) {
      pos = { x: symbol.y + symbol.x - y, y: symbol.y + symbol.x - x };
    } else if (
      symbol.orientation === Orientation.Right ||
      symbol.orientation === Orientation.Left
    ) {
      pos = { x, y: 2 * symbol.y - y };
    } else if (
      symbol.orientation === Orientation.DownRight ||
      symbol.orientation === Orientation.UpLeft
    ) {
      pos = { x: symbol.x - symbol.y + y, y: symbol.y - symbol.x + x };
    }

    return grid.isInBound(pos.x, pos.y) ? pos : null;
  }
}
