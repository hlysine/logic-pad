import { Direction, Position } from './primitives';

export function move(position: Position, direction: Direction) {
  switch (direction) {
    case Direction.Up:
      return { x: position.x, y: position.y - 1 };
    case Direction.Down:
      return { x: position.x, y: position.y + 1 };
    case Direction.Left:
      return { x: position.x - 1, y: position.y };
    case Direction.Right:
      return { x: position.x + 1, y: position.y };
  }
}

export function array<T>(
  width: number,
  height: number,
  value: (x: number, y: number) => T
): T[][] {
  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => value(x, y))
  );
}

export function minBy<T>(values: readonly T[], mapper: (element: T) => number) {
  let min = Number.POSITIVE_INFINITY;
  let result: T | undefined;
  for (const value of values) {
    const mapped = mapper(value);
    if (mapped < min) {
      min = mapped;
      result = value;
    }
  }
  return result;
}

export function maxBy<T>(values: readonly T[], mapper: (element: T) => number) {
  let max = Number.NEGATIVE_INFINITY;
  let result: T | undefined;
  for (const value of values) {
    const mapped = mapper(value);
    if (mapped > max) {
      max = mapped;
      result = value;
    }
  }
  return result;
}
