import { Direction, Position } from './primitives';

/**
 * Offset the given position by a given step in the given direction.
 * @param position The position to offset.
 * @param direction The direction to offset in.
 * @param step The distance to offset by.
 * @returns The offset position.
 */
export function move(position: Position, direction: Direction, step = 1) {
  switch (direction) {
    case Direction.Up:
      return { x: position.x, y: position.y - step };
    case Direction.Down:
      return { x: position.x, y: position.y + step };
    case Direction.Left:
      return { x: position.x - step, y: position.y };
    case Direction.Right:
      return { x: position.x + step, y: position.y };
  }
}

/**
 * Create a new 2D array with the given dimensions and values.
 * @param width The width of the array.
 * @param height The height of the array.
 * @param value A function that returns the value for each x,y coordinate.
 * @returns The 2D array.
 */
export function array<T>(
  width: number,
  height: number,
  value: (x: number, y: number) => T
): T[][] {
  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => value(x, y))
  );
}

/**
 * Return the first element of the array which has the minimum mapped value.
 *
 * @param values The array of values.
 * @param mapper The function to map each value to a number.
 * @returns The first element with the minimum mapped value.
 */
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

/**
 * Return the first element of the array which has the maximum mapped value.
 *
 * @param values The array of values.
 * @param mapper The function to map each value to a number.
 * @returns The first element with the maximum mapped value.
 */
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

/**
 * Escape the given text by replacing the specified characters with HTML escape sequences.
 * @param text The text to escape.
 * @param escapeCharacters The characters to escape.
 * @returns The escaped text.
 */
export function escape(text: string, escapeCharacters = '=,:|') {
  let result = '';
  for (const char of text) {
    if (escapeCharacters.includes(char) || char === '&') {
      result += `&#${char.charCodeAt(0)};`;
    } else {
      result += char;
    }
  }
  return result;
}

/**
 * Unescape the given text by replacing HTML escape sequences with the corresponding characters.
 * @param text The text to unescape.
 * @param escapeCharacters The characters to unescape. This should match the characters escaped by the `escape` function.
 * @returns The unescaped text.
 */
export function unescape(text: string, escapeCharacters = '=,:|') {
  let result = '';
  const matches = text.matchAll(/&#([0-9]+);/g);
  let index = 0;
  for (const match of matches) {
    result += text.substring(index, match.index);
    const char = String.fromCharCode(parseInt(match[1], 10));
    if (escapeCharacters.includes(char) || char === '&') {
      result += char;
    } else {
      result += match[0];
    }
    index = match.index + match[0].length;
  }
  return result + text.substring(index);
}
