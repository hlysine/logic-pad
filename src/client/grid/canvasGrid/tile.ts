import { Color } from '@logic-pad/core/data/primitives.js';
import TileData from '@logic-pad/core/data/tile.js';
import TileConnections from '@logic-pad/core/data/tileConnections.js';
import {
  TL,
  TR,
  BL,
  BR,
  connectionsToId,
  getEm,
  tileShapes,
} from '../tileInfo';

export interface ColorInfo {
  black: string;
  white: string;
  neutral: string;
}

export function clearTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  const tx = Math.floor(x * size);
  const ty = Math.floor(y * size);
  const tx1 = Math.floor((x + 1) * size);
  const ty1 = Math.floor((y + 1) * size);
  ctx.clearRect(tx, ty, tx1 - tx, ty1 - ty);
}

export function renderFixed(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  const px = -size / 2;
  const py = -size / 2;
  const gap = size * 0.025;
  const length = (size - gap * 2) * 0.25;
  ctx.fillStyle = '#16a34a';
  ctx.save();
  ctx.translate(x * size + size / 2, y * size + size / 2);
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(px + gap, py + gap);
    ctx.lineTo(px + gap + length, py + gap);
    ctx.bezierCurveTo(
      px + gap + length,
      py + gap * 2,
      px + gap * 3 + (length - gap * 2) / 2,
      py + gap * 3,
      px + gap * 3,
      py + gap * 3
    );
    ctx.bezierCurveTo(
      px + gap * 3,
      py + gap * 3 + (length - gap * 2) / 2,
      px + gap * 2,
      py + gap + length,
      px + gap,
      py + gap + length
    );
    ctx.fill();
  }
  ctx.restore();
}

export function renderTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  tile: TileData,
  connections: TileConnections,
  colors: ColorInfo
) {
  switch (tile.color) {
    case Color.Dark:
      ctx.fillStyle = colors.black;
      break;
    case Color.Light:
      ctx.fillStyle = colors.white;
      break;
    default:
      ctx.fillStyle = colors.neutral;
      break;
  }
  const tx = Math.floor(x * size);
  const ty = Math.floor(y * size);
  const tx1 = Math.floor((x + 1) * size);
  const ty1 = Math.floor((y + 1) * size);
  const radius = size * 0.125;
  ctx.beginPath();
  const key = connectionsToId(connections);
  const shape = tileShapes.get(key);
  if (!shape) {
    throw new Error(`No shape for connections ${key}`);
  }
  shape.forEach(part => {
    ctx.roundRect(
      tx + Math.floor(getEm(part.l) * size),
      ty + Math.floor(getEm(part.t) * size),
      tx1 -
        Math.floor(getEm(part.r) * size) -
        (tx + Math.floor(getEm(part.l) * size)),
      ty1 -
        Math.floor(getEm(part.b) * size) -
        (ty + Math.floor(getEm(part.t) * size)),
      [
        part.corners & TL ? radius : 0,
        part.corners & TR ? radius : 0,
        part.corners & BR ? radius : 0,
        part.corners & BL ? radius : 0,
      ]
    );
  });
  ctx.fill();
  if (tile.fixed) {
    renderFixed(ctx, x, y, size);
  }
}
