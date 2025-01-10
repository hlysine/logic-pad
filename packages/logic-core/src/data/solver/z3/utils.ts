import { RectangularLattice } from 'grilops';
import { Direction, Orientation } from '../../primitives.js';

export function convertDirection(direction: Orientation | Direction) {
  switch (direction) {
    case Direction.Up:
    case Orientation.Up:
      return RectangularLattice.VERTEX_DIRECTIONS.N;
    case Direction.Down:
    case Orientation.Down:
      return RectangularLattice.VERTEX_DIRECTIONS.S;
    case Direction.Left:
    case Orientation.Left:
      return RectangularLattice.VERTEX_DIRECTIONS.W;
    case Direction.Right:
    case Orientation.Right:
      return RectangularLattice.VERTEX_DIRECTIONS.E;
    case Orientation.DownLeft:
      return RectangularLattice.VERTEX_DIRECTIONS.SW;
    case Orientation.DownRight:
      return RectangularLattice.VERTEX_DIRECTIONS.SE;
    case Orientation.UpLeft:
      return RectangularLattice.VERTEX_DIRECTIONS.NW;
    case Orientation.UpRight:
      return RectangularLattice.VERTEX_DIRECTIONS.NE;
  }
}
