import { Color } from './primitives';
import TileData from './tile';

export interface ShapeElement {
  x: number;
  y: number;
  color: Color;
}

export interface Shape {
  width: number;
  height: number;
  elements: ShapeElement[];
}

const colorIndex = {
  [Color.Dark]: 2,
  [Color.Light]: 1,
  [Color.Gray]: 0,
};

function compareColor(a: Color, b: Color) {
  return colorIndex[a] - colorIndex[b];
}

function compareElement(a: ShapeElement, b: ShapeElement) {
  return a.y - b.y || a.x - b.x || compareColor(a.color, b.color);
}

function compareShape(a: Shape, b: Shape) {
  for (let i = 0; i < a.elements.length; i++) {
    const cmp = compareElement(a.elements[i], b.elements[i]);
    if (cmp !== 0) return cmp;
  }
  return 0;
}

function recenterShape(shape: Shape): Shape {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const element of shape.elements) {
    minX = Math.min(minX, element.x);
    minY = Math.min(minY, element.y);
    maxX = Math.max(maxX, element.x);
    maxY = Math.max(maxY, element.y);
  }
  for (const element of shape.elements) {
    element.x -= minX;
    element.y -= minY;
  }
  shape.width = maxX - minX + 1;
  shape.height = maxY - minY + 1;
  return shape;
}

export function tilesToShape(tiles: readonly (readonly TileData[])[]): Shape {
  const shape: Shape = {
    width: Math.max(...tiles.map(row => row.length)),
    height: tiles.length,
    elements: [],
  };
  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[y].length; x++) {
      const tile = tiles[y][x];
      if (tile.exists && tile.color !== Color.Gray) {
        shape.elements.push({ x, y, color: tile.color });
      }
    }
  }
  return recenterShape(shape);
}

type CoordMap = 'x' | 'y' | '-x' | '-y';

const shapeVariants: { x: CoordMap; y: CoordMap }[] = [
  { x: 'x', y: 'y' },
  { x: '-y', y: 'x' },
  { x: '-x', y: '-y' },
  { x: 'y', y: '-x' },
  { x: '-x', y: 'y' },
  { x: 'x', y: '-y' },
  { x: 'y', y: 'x' },
  { x: '-y', y: '-x' },
];

function mapCoord(
  map: CoordMap,
  x: number,
  y: number,
  width: number,
  height: number
) {
  switch (map) {
    case 'x':
      return x;
    case 'y':
      return y;
    case '-x':
      return width - 1 - x;
    case '-y':
      return height - 1 - y;
  }
}

export function getShapeVariants(shape: Shape): Shape[] {
  const variants = shapeVariants.map(({ x, y }) => ({
    width: x.endsWith('x') ? shape.width : shape.height,
    height: y.endsWith('y') ? shape.height : shape.width,
    elements: shape.elements
      .map(element => ({
        x: mapCoord(x, element.x, element.y, shape.width, shape.height),
        y: mapCoord(y, element.x, element.y, shape.width, shape.height),
        color: element.color,
      }))
      .sort(compareElement),
  }));
  const uniqueVariants: Shape[] = [];
  for (const variant of variants) {
    if (!uniqueVariants.some(shape => compareShape(shape, variant) === 0)) {
      uniqueVariants.push(variant);
    }
  }
  return uniqueVariants;
}

export function normalizeShape(shape: Shape): Shape {
  const variants = getShapeVariants(shape);
  return variants.reduce(
    (min, variant) => (compareShape(variant, min) < 0 ? variant : min),
    variants[0]
  );
}
