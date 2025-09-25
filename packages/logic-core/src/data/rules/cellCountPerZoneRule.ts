import { array } from '../dataHelper.js';
import GridData, { NEIGHBOR_OFFSETS } from '../grid.js';
import { Color, Position } from '../primitives.js';
import Rule from './rule.js';

export interface Zone {
  positions: Position[];
  completed: number;
  possible: number;
}

export type ZoneCounts = {
  zones: Zone[];
  complete: boolean;
};

export default abstract class CellCountPerZoneRule extends Rule {
  public get configExplanation() {
    return 'Use the zone tool to define areas on the grid.';
  }

  /**
   * @param color - The color of the cells to count.
   */
  public constructor(public readonly color: Color) {
    super();
    this.color = color;
  }

  protected getZoneCounts(grid: GridData): ZoneCounts {
    let complete = true;
    const visited = array(
      grid.width,
      grid.height,
      (i, j) => !grid.getTile(i, j).exists
    );
    const zones: Zone[] = [];
    while (true) {
      const seed = grid.find((_tile, x, y) => !visited[y][x]);
      if (!seed) break;
      const zone: Zone = {
        positions: [],
        completed: 0,
        possible: 0,
      };
      const stack = [seed];
      while (stack.length > 0) {
        let { x, y } = stack.pop()!;
        ({ x, y } = grid.toArrayCoordinates(x, y));
        if (visited[y][x]) continue;
        visited[y][x] = true;
        zone.positions.push({ x, y });
        if (grid.getTile(x, y).color === this.color) {
          zone.completed++;
        } else if (grid.getTile(x, y).color === Color.Gray) {
          zone.possible++;
          complete = false;
        }
        for (const offset of NEIGHBOR_OFFSETS) {
          const next = grid.toArrayCoordinates(x + offset.x, y + offset.y);
          if (
            !grid.zones.edges.some(e => {
              const { x: x1, y: y1 } = grid.toArrayCoordinates(e.x1, e.y1);
              const { x: x2, y: y2 } = grid.toArrayCoordinates(e.x2, e.y2);
              return (
                (x1 === x && y1 === y && x2 === next.x && y2 === next.y) ||
                (x2 === x && y2 === y && x1 === next.x && y1 === next.y)
              );
            })
          ) {
            const nextTile = grid.getTile(next.x, next.y);
            if (nextTile.exists) {
              stack.push(next);
            }
          }
        }
      }
      zones.push(zone);
    }
    return { zones, complete };
  }

  public withColor(color: Color): this {
    return this.copyWith({ color });
  }
}

export const instance = undefined;
