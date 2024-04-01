import { AnyConfig, ConfigType } from '../config';
import GridData from '../grid';
import { Color, Direction, Position, State } from '../primitives';
import Symbol from './symbol';

export type DirectionLinkerMap = {
  [key in Direction]: Direction;
};

type Turtle = [Position, Position];

export default class DirectionLinkerSymbol extends Symbol {
  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['wwbbw', 'wwwww', 'wwwww', 'wwwww'])
  );

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

  public createExampleGrid(): GridData {
    return DirectionLinkerSymbol.EXAMPLE_GRID;
  }

  public get configs(): readonly AnyConfig[] | null {
    return DirectionLinkerSymbol.CONFIGS;
  }

  private getColor(c: Position, grid: GridData): Color | null {
    if (!grid.isPositionValid(c.x, c.y) || !grid.getTile(c.x, c.y).exists) {
      return null;
    }
    return grid.getTile(c.x, c.y).color;
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

    const baseColor = grid.getTile(
      Math.round(this.x),
      Math.round(this.y)
    ).color;
    if (baseColor === Color.Gray) {
      return State.Incomplete;
    }

    const checkedCouples: Turtle[] = this.getInitialCheckedCouples(
      this.x,
      this.y
    );
    const queue: Turtle[] = checkedCouples.map(([p1, p2]) => [
      { ...p1 },
      { ...p2 },
    ]);

    let grayFound = false;

    while (queue.length > 0) {
      const turtle = queue.shift()!;
      const [c1, c2] = turtle;
      const color1 = this.getColor(c1, grid);
      const color2 = this.getColor(c2, grid);
      const colorSet = new Set([color1, color2]);
      if (colorSet.has(null) && !colorSet.has(baseColor)) {
        colorSet.delete(null);
      }

      if (colorSet.size === 2 && !colorSet.has(Color.Gray)) {
        return State.Error;
      }

      if (colorSet.has(Color.Gray)) {
        grayFound = true;
      }

      if (color1 === baseColor) {
        const directions = Object.keys(this.linkedDirections) as Direction[];
        for (const direction of directions) {
          const newTurtle: Turtle = [
            this.deltaCoordinate(c1, direction),
            this.deltaCoordinate(c2, this.linkedDirections[direction]),
          ];
          if (
            checkedCouples.some(
              ([c1, c2]) =>
                c1.x === newTurtle[0].x &&
                c1.y === newTurtle[0].y &&
                c2.x === newTurtle[1].x &&
                c2.y === newTurtle[1].y
            ) ||
            (c1.x === newTurtle[1].x &&
              c1.y === newTurtle[1].y &&
              c2.x === newTurtle[0].x &&
              c2.y === newTurtle[0].y)
          ) {
            continue;
          }
          checkedCouples.push([newTurtle[0], newTurtle[1]]);
          queue.push(newTurtle);
        }
      }
    }

    return grayFound ? State.Incomplete : State.Satisfied;
  }

  public copyWith({ x, y }: { x?: number; y?: number }): this {
    return new DirectionLinkerSymbol(x ?? this.x, y ?? this.y) as this;
  }

  private getInitialCheckedCouples(x: number, y: number): Turtle[] {
    // 1x1
    if (x % 1 === 0 && y % 1 === 0) {
      return [
        [
          { x, y },
          { x, y },
        ],
      ];
    }

    // 1x2
    if (x % 1 === 0) {
      return [
        [
          { x, y: y - 0.5 },
          {
            x,
            y:
              y +
              (this.linkedDirections[Direction.Up] === Direction.Up &&
              this.linkedDirections[Direction.Down] === Direction.Down
                ? -0.5
                : 0.5),
          },
        ],
      ];
    }

    // 2x1
    if (y % 1 === 0) {
      return [
        [
          { x: x - 0.5, y },
          {
            x:
              x +
              (this.linkedDirections[Direction.Left] === Direction.Left &&
              this.linkedDirections[Direction.Right] === Direction.Right
                ? -0.5
                : 0.5),
            y,
          },
        ],
      ];
    }

    // 2x2
    if (
      this.linkedDirections[Direction.Left] === Direction.Left &&
      this.linkedDirections[Direction.Right] === Direction.Right
    ) {
      return [
        [
          { x: x - 0.5, y: y - 0.5 },
          { x: x - 0.5, y: y + 0.5 },
        ],
        [
          { x: x + 0.5, y: y - 0.5 },
          { x: x + 0.5, y: y + 0.5 },
        ],
      ];
    }
    if (
      this.linkedDirections[Direction.Up] === Direction.Up &&
      this.linkedDirections[Direction.Down] === Direction.Down
    ) {
      return [
        [
          { x: x - 0.5, y: y - 0.5 },
          { x: x + 0.5, y: y - 0.5 },
        ],
        [
          { x: x - 0.5, y: y + 0.5 },
          { x: x + 0.5, y: y + 0.5 },
        ],
      ];
    } else if (
      (this.linkedDirections[Direction.Up] === Direction.Left &&
        this.linkedDirections[Direction.Left] === Direction.Up) ||
      (this.linkedDirections[Direction.Up] === Direction.Right &&
        this.linkedDirections[Direction.Right] === Direction.Up)
    ) {
      return [
        [
          { x: x - 0.5, y: y - 0.5 },
          { x: x - 0.5, y: y - 0.5 },
        ],
      ];
    }
    return [
      [
        { x: x - 0.5, y: y - 0.5 },
        { x: x + 0.5, y: y + 0.5 },
      ],
      [
        { x: x - 0.5, y: y + 0.5 },
        { x: x + 0.5, y: y - 0.5 },
      ],
    ];
  }
}
