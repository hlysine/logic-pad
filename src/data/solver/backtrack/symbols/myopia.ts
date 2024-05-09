import { move } from '../../../helper';
import { ORIENTATIONS, Orientation, Position } from '../../../primitives';
import MyopiaSymbol from '../../../symbols/myopiaSymbol';
import BTModule, {
  BTColor,
  BTGridData,
  BTTile,
  CheckResult,
  createOneTileResult,
  getOppositeColor,
} from '../data';

export default class MyopiaBTModule extends BTModule {
  public instr: MyopiaSymbol;

  public constructor(instr: MyopiaSymbol) {
    super();
    this.instr = instr;
  }

  public checkGlobal(grid: BTGridData): CheckResult | false {
    // TODO: Optimize myopia symbol
    // TODO: What to do if a non-existence tile is in front?

    const tile = grid.getTile(this.instr.x, this.instr.y);

    if (tile == BTTile.Empty)
      return createOneTileResult(grid, { x: this.instr.x, y: this.instr.y });

    const traverse = (dir: Orientation): [number, number, boolean] => {
      let min = 0;
      let max = 0;

      let connected = true;
      let stopped = false;

      let pos = move(this.instr, dir);

      while (grid.isInBound(pos.x, pos.y)) {
        const curTile = grid.getTile(pos.x, pos.y);

        if (connected) {
          if (tile == curTile) {
            min += 1;
          } else {
            connected = false;
          }
        }

        if (
          getOppositeColor(tile as BTColor) == curTile ||
          curTile == BTTile.Border
        ) {
          stopped = true;
          break;
        }

        max += 1;

        pos = move(pos, dir);
      }

      return [min, stopped ? max : Number.MAX_SAFE_INTEGER, connected];
    };

    const allDirections = this.instr.containsDiagonal
      ? ORIENTATIONS
      : [Orientation.Up, Orientation.Down, Orientation.Left, Orientation.Right];

    const pointedDirections: [number, number, boolean][] = [];
    const otherDirections: [number, number, boolean][] = [];

    for (const dir of allDirections) {
      const res = traverse(dir);
      if (this.instr.directions[dir]) {
        pointedDirections.push(res);
      } else {
        otherDirections.push(res);
      }
    }

    for (let i = 0; i < pointedDirections.length; i++) {
      const direction1 = pointedDirections[i];
      for (let j = i + 1; j < pointedDirections.length; j++) {
        const direction2 = pointedDirections[j];
        if (direction1[0] > direction2[1] || direction2[0] > direction1[1])
          return false;
      }
    }

    if (
      Math.min(...otherDirections.map(d => d[1])) <=
      Math.max(...pointedDirections.map(d => d[0]))
    )
      return false;

    if (
      pointedDirections.length === 0 &&
      otherDirections.some(d => d[1] !== Number.MAX_SAFE_INTEGER)
    )
      return false;

    if (pointedDirections.some(d => d[2] && d[1] === Number.MAX_SAFE_INTEGER))
      return false;

    return { tilesNeedCheck: null, ratings: null };
  }

  public checkLocal(grid: BTGridData, _: Position[]): CheckResult | false {
    return this.checkGlobal(grid);
  }
}
