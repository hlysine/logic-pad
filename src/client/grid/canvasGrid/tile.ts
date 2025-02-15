import { Color } from '@logic-pad/core/data/primitives';
import TileData from '@logic-pad/core/data/tile';
import TileConnections from '@logic-pad/core/data/tileConnections';
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
  size: number,
  connections: TileConnections
) {
  const px = -size / 2;
  const py = -size / 2;
  const gap = size * 0.025;
  const length = (size - gap * 2) * 0.25;
  ctx.fillStyle = '#16a34a';
  ctx.save();
  ctx.translate(x * size + size / 2, y * size + size / 2);
  const corners = [
    connections.top || connections.topLeft || connections.left,
    connections.top || connections.topRight || connections.right,
    connections.bottom || connections.bottomRight || connections.right,
    connections.bottom || connections.bottomLeft || connections.left,
  ];
  for (let i = 0; i < 4; i++) {
    const trueLength = corners[i] ? (length - gap * 2) / 3 + gap * 2 : length;
    ctx.beginPath();
    ctx.moveTo(px + gap, py + gap);
    ctx.lineTo(px + gap + trueLength, py + gap);
    ctx.bezierCurveTo(
      px + gap + trueLength,
      py + gap * 2,
      px + gap * 3 + (trueLength - gap * 2) / 2,
      py + gap * 3,
      px + gap * 3,
      py + gap * 3
    );
    ctx.bezierCurveTo(
      px + gap * 3,
      py + gap * 3 + (trueLength - gap * 2) / 2,
      px + gap * 2,
      py + gap + trueLength,
      px + gap,
      py + gap + trueLength
    );
    ctx.fill();
    ctx.rotate(Math.PI / 2);
  }
  ctx.restore();
}

function ensureGap(length: number) {
  if (length === 0) return length;
  return Math.max(0.5, length);
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
    const left = ensureGap(getEm(part.l) * size);
    const top = ensureGap(getEm(part.t) * size);
    const right = ensureGap(getEm(part.r) * size);
    const bottom = ensureGap(getEm(part.b) * size);
    ctx.roundRect(
      tx + left,
      ty + top,
      tx1 - right - (tx + left),
      ty1 - bottom - (ty + top),
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
    renderFixed(ctx, x, y, size, connections);
  }
}
