import { AnyConfig, ConfigType } from '../config.js';
import GridData from '../grid.js';
import { Color, Direction, Position, State } from '../primitives.js';
import Symbol from './symbol.js';

export type DirectionLinkerMap = Record<Direction, Direction>;

type Turtle = {
  pos1: Position;
  color1: Color | null;
  pos2: Position;
  color2: Color | null;
};

function getColor(c: Position, grid: GridData): Color | null {
  if (!grid.isPositionValid(c.x, c.y) || !grid.getTile(c.x, c.y).exists) {
    return null;
  }
  return grid.getTile(c.x, c.y).color;
}

function makeTurtle(pos1: Position, pos2: Position, grid: GridData): Turtle {
  return {
    pos1,
    color1: getColor(pos1, grid),
    pos2,
    color2: getColor(pos2, grid),
  };
}

export default class DirectionLinkerSymbol extends Symbol {
  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.Number,
      default: 0,
      field: 'x',
      description: 'X',
      configurable: false,
    },
    {
      type: ConfigType.Number,
      default: 0,
      field: 'y',
      description: 'Y',
      configurable: false,
    },
  ]);

  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['wwbbw', 'wwwww', 'wwwww', 'wwwww'])
  );

  private static readonly directionDeltas = {
    [Direction.Up]: { dx: 0, dy: -1 },
    [Direction.Down]: { dx: 0, dy: 1 },
    [Direction.Left]: { dx: -1, dy: 0 },
    [Direction.Right]: { dx: 1, dy: 0 },
  };

  private linkedDirections: {
    [Direction.Left]: Direction;
    [Direction.Up]: Direction;
    [Direction.Right]: Direction;
    [Direction.Down]: Direction;
  } = {
    [Direction.Left]: Direction.Left,
    [Direction.Up]: Direction.Up,
    [Direction.Right]: Direction.Right,
    [Direction.Down]: Direction.Down,
  };

  /**
   * **Darts count opposite color cells in that direction**
   *
   * @param x - The x-coordinate of the symbol.
   * @param y - The y-coordinate of the symbol.
   */
  public constructor(
    public readonly x: number,
    public readonly y: number
  ) {
    super(x, y);
  }

  public changeDirections(linkedDirections: DirectionLinkerMap): this {
    this.linkedDirections = linkedDirections;
    return this;
  }

  public get id(): string {
    return `linkedDirection`;
  }

  public get explanation(): string {
    return `Direction pointed by this symbol should *behave* the same.`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return DirectionLinkerSymbol.CONFIGS;
  }

  public createExampleGrid(): GridData {
    return DirectionLinkerSymbol.EXAMPLE_GRID;
  }

  private deltaCoordinate(c: Position, direction: Direction): Position {
    return {
      x: c.x + DirectionLinkerSymbol.directionDeltas[direction].dx,
      y: c.y + DirectionLinkerSymbol.directionDeltas[direction].dy,
    };
  }

  public validateSymbol(grid: GridData): State {
    // A turtle is an object which have 2 coordinates
    // This turtle when activated will check the color of both the cells it is pointing to
    // If the color of one of the cell is gray, the turtle doesn't fire any other turtle
    // If one of the turtle's coordinate is out of the grid, consider it's color as opposite of the base color
    // If the color of both cells are different, return a State.Error
    // If the color of both are the same as the color of the turtle, the turtle fires another turtle in all the directions according to the linked directions except the one it came from and the directions where a turtle has already been fired
    // If the color of both are the opposite of the turtle, the turtle doesn't fire any other turtle
    // If no turtle remains, go to final state
    // Final state is State.Satisfied if no gray cell is found, State.Incomplete otherwise

    let checkedCouples: Turtle[] = this.getInitialCheckedCouples(
      this.x,
      this.y,
      grid
    );
    if (
      checkedCouples.some(
        ({ color1, color2 }) =>
          (color1 === null && color2 !== null) ||
          (color1 !== null && color2 === null)
      )
    ) {
      return State.Error;
    }
    if (
      checkedCouples.some(
        ({ color1, color2 }) => color1 === Color.Gray || color2 === Color.Gray
      )
    ) {
      return State.Incomplete;
    }
    checkedCouples = checkedCouples.filter(
      ({ color1, color2 }) => color1 !== null && color2 !== null
    );
    const queue: Turtle[] = checkedCouples.slice();

    let grayFound = false;

    while (queue.length > 0) {
      const turtle = queue.shift()!;
      const { pos1, pos2, color1: baseColor1, color2: baseColor2 } = turtle;
      const color1 = getColor(pos1, grid);
      const color2 = getColor(pos2, grid);
      if (color1 === Color.Gray || color2 === Color.Gray) {
        grayFound = true;
      } else if (color1 === null || color2 === null) {
        if (
          (color1 === null && color2 === baseColor2) ||
          (color2 === null && color1 === baseColor1)
        ) {
          return State.Error;
        }
      } else if (color1 !== baseColor1 || color2 !== baseColor2) {
        if (color1 === baseColor1 || color2 === baseColor2) {
          return State.Error;
        }
      }

      if (color1 === baseColor1) {
        const directions = Object.keys(this.linkedDirections) as Direction[];
        for (const direction of directions) {
          const newTurtle: Turtle = {
            pos1: this.deltaCoordinate(pos1, direction),
            pos2: this.deltaCoordinate(pos2, this.linkedDirections[direction]),
            color1: baseColor1,
            color2: baseColor2,
          };
          const newArrTurtle: Turtle = {
            pos1: grid.toArrayCoordinates(newTurtle.pos1.x, newTurtle.pos1.y),
            pos2: grid.toArrayCoordinates(newTurtle.pos2.x, newTurtle.pos2.y),
            color1: baseColor1,
            color2: baseColor2,
          };
          const newColor1 = getColor(newArrTurtle.pos1, grid);
          const newColor2 = getColor(newArrTurtle.pos2, grid);
          if (
            newColor1 !== baseColor1 &&
            newColor2 !== baseColor2 &&
            newColor1 !== Color.Gray &&
            newColor2 !== Color.Gray
          ) {
            continue;
          }
          if (
            checkedCouples.some(
              ({ pos1, pos2 }) =>
                pos1.x === newArrTurtle.pos1.x &&
                pos1.y === newArrTurtle.pos1.y &&
                pos2.x === newArrTurtle.pos2.x &&
                pos2.y === newArrTurtle.pos2.y
            ) ||
            (pos1.x === newArrTurtle.pos2.x &&
              pos1.y === newArrTurtle.pos2.y &&
              pos2.x === newArrTurtle.pos1.x &&
              pos2.y === newArrTurtle.pos1.y)
          ) {
            continue;
          }
          checkedCouples.push(newArrTurtle);
          queue.push(newTurtle);
        }
      }
    }

    return grayFound ? State.Incomplete : State.Satisfied;
  }

  public copyWith({ x, y }: { x?: number; y?: number }): this {
    return new DirectionLinkerSymbol(x ?? this.x, y ?? this.y) as this;
  }

  private getInitialCheckedCouples(
    x: number,
    y: number,
    grid: GridData
  ): Turtle[] {
    // 1x1
    if (x % 1 === 0 && y % 1 === 0) {
      return [makeTurtle({ x, y }, { x, y }, grid)];
    }

    // 1x2
    if (x % 1 === 0) {
      if (
        this.linkedDirections[Direction.Up] === Direction.Up &&
        this.linkedDirections[Direction.Down] === Direction.Down
      ) {
        return [
          makeTurtle({ x, y: y - 0.5 }, { x, y: y - 0.5 }, grid),
          makeTurtle({ x, y: y + 0.5 }, { x, y: y + 0.5 }, grid),
        ];
      } else {
        return [makeTurtle({ x, y: y - 0.5 }, { x, y: y + 0.5 }, grid)];
      }
    }

    // 2x1
    if (y % 1 === 0) {
      if (
        this.linkedDirections[Direction.Left] === Direction.Left &&
        this.linkedDirections[Direction.Right] === Direction.Right
      ) {
        return [
          makeTurtle({ x: x - 0.5, y }, { x: x - 0.5, y }, grid),
          makeTurtle({ x: x + 0.5, y }, { x: x + 0.5, y }, grid),
        ];
      } else {
        return [makeTurtle({ x: x - 0.5, y }, { x: x + 0.5, y }, grid)];
      }
    }

    // 2x2
    if (
      this.linkedDirections[Direction.Left] === Direction.Left &&
      this.linkedDirections[Direction.Right] === Direction.Right
    ) {
      return [
        makeTurtle(
          { x: x - 0.5, y: y - 0.5 },
          { x: x - 0.5, y: y + 0.5 },
          grid
        ),
        makeTurtle(
          { x: x + 0.5, y: y - 0.5 },
          { x: x + 0.5, y: y + 0.5 },
          grid
        ),
      ];
    }
    if (
      this.linkedDirections[Direction.Up] === Direction.Up &&
      this.linkedDirections[Direction.Down] === Direction.Down
    ) {
      return [
        makeTurtle(
          { x: x - 0.5, y: y - 0.5 },
          { x: x + 0.5, y: y - 0.5 },
          grid
        ),
        makeTurtle(
          { x: x - 0.5, y: y + 0.5 },
          { x: x + 0.5, y: y + 0.5 },
          grid
        ),
      ];
    } else if (
      (this.linkedDirections[Direction.Up] === Direction.Left &&
        this.linkedDirections[Direction.Left] === Direction.Up) ||
      (this.linkedDirections[Direction.Up] === Direction.Right &&
        this.linkedDirections[Direction.Right] === Direction.Up)
    ) {
      return [
        makeTurtle(
          { x: x - 0.5, y: y - 0.5 },
          { x: x - 0.5, y: y - 0.5 },
          grid
        ),
      ];
    }
    return [
      makeTurtle({ x: x - 0.5, y: y - 0.5 }, { x: x + 0.5, y: y + 0.5 }, grid),
      makeTurtle({ x: x - 0.5, y: y + 0.5 }, { x: x + 0.5, y: y - 0.5 }, grid),
    ];
  }
}

export const instance = undefined;
