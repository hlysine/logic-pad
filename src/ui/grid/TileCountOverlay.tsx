import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../ThemeContext';
import GridCanvasOverlay, { RawCanvasRef } from './GridCanvasOverlay';
import { useHotkeys } from 'react-hotkeys-hook';
import { Color, DIRECTIONS, Direction, Position } from '../../data/primitives';
import GridData from '../../data/grid';
import { mousePosition } from '../../utils';
import ViewpointSymbol, {
  instance as viewpointInstance,
} from '../../data/symbols/viewpointSymbol';
import { move } from '../../data/helper';

export interface TileCountOverlayProps {
  grid: GridData;
}

const PADDING = 5;
const BLEED = 5;

function canvasTextBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  align: 'left' | 'right',
  text: string,
  color: string,
  fontSize: number
) {
  ctx.font = `${fontSize}px ${window.getComputedStyle(document.body).fontFamily}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.lineWidth = 5;

  const textWidth = ctx.measureText(text).width + PADDING * 2;
  const textHeight = fontSize + PADDING * 2;

  ctx.fillStyle = color;
  ctx.globalAlpha = 0.5;
  if (align === 'left') ctx.fillRect(x, y, textWidth, textHeight);
  else ctx.fillRect(x - textWidth, y, textWidth, textHeight);

  ctx.globalAlpha = 1;
  ctx.strokeStyle = color;
  if (align === 'left') ctx.strokeRect(x, y, textWidth, textHeight);
  else ctx.strokeRect(x - textWidth, y, textWidth, textHeight);

  ctx.strokeStyle = 'black';
  if (align === 'left') ctx.strokeText(text, x + PADDING, y + PADDING);
  else ctx.strokeText(text, x - textWidth + PADDING, y + PADDING);
  ctx.fillStyle = 'white';
  if (align === 'left') ctx.fillText(text, x + PADDING, y + PADDING);
  else ctx.fillText(text, x - textWidth + PADDING, y + PADDING);
}

export default memo(function TileCountOverlay({ grid }: TileCountOverlayProps) {
  const { theme } = useTheme();
  const canvasRef = useRef<RawCanvasRef>(null);
  const [tileSize, setTileSize] = useState(0);
  const [position, setPosition] = useState<Position | null>(null);

  const accentColor = useMemo(
    () =>
      window.getComputedStyle(document.getElementById('color-ref-accent')!)
        .color,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  useHotkeys(
    'ctrl',
    e => {
      if (!canvasRef.current) return;
      if (e.type === 'keydown') {
        const rect = canvasRef.current.canvas.getBoundingClientRect();
        const x = Math.floor((mousePosition.clientX - rect.left) / tileSize);
        const y = Math.floor((mousePosition.clientY - rect.top) / tileSize);
        setPosition({ x, y });
      } else {
        setPosition(null);
      }
    },
    {
      keydown: true,
      keyup: true,
      preventDefault: true,
    },
    [canvasRef, tileSize]
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    if (tileSize === 0) return;
    const { ctx } = canvasRef.current;

    ctx.clearRect(
      -BLEED,
      -BLEED,
      grid.width * tileSize + 2 * BLEED,
      grid.height * tileSize + 2 * BLEED
    );

    if (!position) return;
    const tile = grid.getTile(position.x, position.y);
    if (!tile.exists) return;

    const viewpoint = grid.symbols
      .get(viewpointInstance.id)
      ?.find(
        sym =>
          Math.floor(sym.x) === position.x && Math.floor(sym.y) === position.y
      ) as ViewpointSymbol | undefined;

    if (viewpoint) {
      const textX =
        position.x < 2
          ? position.x * tileSize + tileSize + PADDING
          : position.x * tileSize - PADDING;
      const textY = position.y * tileSize;

      const count = viewpoint.countTiles(grid);
      for (const direction of DIRECTIONS) {
        let localMaxSize = 0;
        grid.iterateDirection(
          move(position, direction),
          direction,
          t => t.color === tile.color || t.color === Color.Gray,
          () => {
            localMaxSize++;
          }
        );
        const start1 = { x: 0, y: 0 };
        const start2 = { x: 0, y: 0 };
        const end1 = { x: 0, y: 0 };
        const end2 = { x: 0, y: 0 };
        switch (direction) {
          case Direction.Up:
            start1.x = position.x * tileSize;
            start1.y = position.y * tileSize;
            end1.x = position.x * tileSize;
            end1.y = Math.max(
              0,
              position.y * tileSize - localMaxSize * tileSize
            );
            start2.x = position.x * tileSize + tileSize;
            start2.y = position.y * tileSize;
            end2.x = position.x * tileSize + tileSize;
            end2.y = Math.max(
              0,
              position.y * tileSize - localMaxSize * tileSize
            );
            break;
          case Direction.Down:
            start1.x = position.x * tileSize;
            start1.y = position.y * tileSize + tileSize;
            end1.x = position.x * tileSize;
            end1.y = Math.min(
              grid.height * tileSize,
              position.y * tileSize + tileSize + localMaxSize * tileSize
            );
            start2.x = position.x * tileSize + tileSize;
            start2.y = position.y * tileSize + tileSize;
            end2.x = position.x * tileSize + tileSize;
            end2.y = Math.min(
              grid.height * tileSize,
              position.y * tileSize + tileSize + localMaxSize * tileSize
            );
            break;
          case Direction.Left:
            start1.x = position.x * tileSize;
            start1.y = position.y * tileSize;
            end1.x = Math.max(
              0,
              position.x * tileSize - localMaxSize * tileSize
            );
            end1.y = position.y * tileSize;
            start2.x = position.x * tileSize;
            start2.y = position.y * tileSize + tileSize;
            end2.x = Math.max(
              0,
              position.x * tileSize - localMaxSize * tileSize
            );
            end2.y = position.y * tileSize + tileSize;
            break;
          case Direction.Right:
            start1.x = position.x * tileSize + tileSize;
            start1.y = position.y * tileSize;
            end1.x = Math.min(
              grid.width * tileSize,
              position.x * tileSize + tileSize + localMaxSize * tileSize
            );
            end1.y = position.y * tileSize;
            start2.x = position.x * tileSize + tileSize;
            start2.y = position.y * tileSize + tileSize;
            end2.x = Math.min(
              grid.width * tileSize,
              position.x * tileSize + tileSize + localMaxSize * tileSize
            );
            end2.y = position.y * tileSize + tileSize;
            break;
        }
        const gradient = ctx?.createLinearGradient(
          start1.x,
          start1.y,
          end1.x,
          end1.y
        );
        gradient?.addColorStop(0, accentColor);
        gradient?.addColorStop(
          2 / 3,
          `${accentColor.substring(0, accentColor.length - 1)}/0)`
        );
        gradient?.addColorStop(
          1,
          `${accentColor.substring(0, accentColor.length - 1)}/0)`
        );
        ctx.strokeStyle = gradient!;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(start1.x, start1.y);
        ctx.lineTo(end1.x, end1.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(start2.x, start2.y);
        ctx.lineTo(end2.x, end2.y);
        ctx.stroke();
      }

      canvasTextBox(
        ctx,
        textX,
        textY,
        position.x < 2 ? 'left' : 'right',
        `${count.completed}/${count.possible}`,
        accentColor,
        30
      );
    } else {
      const textX =
        position.x < 2
          ? position.x * tileSize + tileSize + PADDING
          : position.x * tileSize - PADDING;
      const textY = position.y * tileSize;

      const positions: Position[] = [];
      grid.iterateArea(
        position,
        t => t.exists && t.color === tile.color,
        (_, x, y) => {
          positions.push({ x, y });
        }
      );

      positions.forEach(({ x, y }) => {
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(
          Math.floor(x * tileSize),
          Math.floor(y * tileSize),
          Math.floor((x + 1) * tileSize) - Math.floor(x * tileSize),
          Math.floor((y + 1) * tileSize) - Math.floor(y * tileSize)
        );
        ctx.globalAlpha = 1;
      });

      canvasTextBox(
        ctx,
        textX,
        textY,
        position.x < 2 ? 'left' : 'right',
        `${positions.length}`,
        accentColor,
        30
      );
    }
  }, [grid, position, accentColor, tileSize]);

  return (
    <GridCanvasOverlay
      ref={canvasRef}
      width={grid.width}
      height={grid.height}
      bleed={BLEED}
      onResize={size => setTileSize(size)}
    ></GridCanvasOverlay>
  );
});
