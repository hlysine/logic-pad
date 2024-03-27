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

const escapeCharacters = '=,:|';

export function escape(text: string) {
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

export function unescape(text: string) {
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
    index = match.index! + match[0].length;
  }
  return result + text.substring(index);
}

/* eslint-disable @typescript-eslint/no-floating-promises */
export const compress = async (string: string) => {
  const blobToBase64 = (blob: Blob) =>
    new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(blob);
    });
  const byteArray = new TextEncoder().encode(string);
  const cs = new CompressionStream('gzip');
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  return new Response(cs.readable).blob().then(blobToBase64);
};

export const decompress = async (base64string: string) => {
  const bytes = Uint8Array.from(atob(base64string), c => c.charCodeAt(0));
  const cs = new DecompressionStream('gzip');
  const writer = cs.writable.getWriter();
  writer.write(bytes);
  writer.close();
  return new Response(cs.readable).arrayBuffer().then(function (arrayBuffer) {
    return new TextDecoder().decode(arrayBuffer);
  });
};
