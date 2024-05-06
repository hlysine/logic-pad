import { memo, useMemo, useRef, useState } from 'react';
import { useTheme } from '../ThemeContext';
import GridCanvasOverlay from './GridCanvasOverlay';
import { useHotkeys } from 'react-hotkeys-hook';
import { Color, DIRECTIONS, Direction, Position } from '../../data/primitives';
import GridData from '../../data/grid';
import { mousePosition } from '../../utils';
import { Line, Rect, Text } from 'react-konva';
import ViewpointSymbol, {
  instance as viewpointInstance,
} from '../../data/symbols/viewpointSymbol';
import { move } from '../../data/helper';

export interface TileCountOverlayProps {
  grid: GridData;
}

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

function CanvasTextBox({
  x,
  y,
  width,
  height,
  color,
  text,
  fontSize,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text: string;
  fontSize: number;
}) {
  return (
    <>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        opacity={0.5}
      />
      <Rect x={x} y={y} width={width} height={height} stroke={color} />
      <Text
        x={x}
        y={y}
        width={width}
        height={height}
        text={text}
        align="center"
        fontSize={fontSize}
        fontFamily="Palatino, Palatino Linotype, Palatino LT STD, Book Antiqua, Georgia, serif"
        verticalAlign="middle"
        fill="white"
        stroke="black"
        strokeWidth={5}
        fillAfterStrokeEnabled={true}
      />
    </>
  );
}

const PADDING = 5;

export default memo(function TileCountOverlay({ grid }: TileCountOverlayProps) {
  const { theme } = useTheme();
  const overlayRef = useRef<HTMLDivElement>(null);
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
      if (!overlayRef.current) return;
      if (e.type === 'keydown') {
        const rect = overlayRef.current.getBoundingClientRect();
        const tileSize = overlayRef.current.offsetWidth / grid.width;
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
    }
  );

  return (
    <GridCanvasOverlay
      ref={overlayRef}
      width={grid.width}
      height={grid.height}
      bleed={5}
    >
      {tileSize => {
        if (!position) return null;
        const tile = grid.getTile(position.x, position.y);
        if (!tile.exists || tile.color === Color.Gray) return null;

        const viewpoint = grid.symbols
          .get(viewpointInstance.id)
          ?.find(
            sym =>
              Math.floor(sym.x) === position.x &&
              Math.floor(sym.y) === position.y
          ) as ViewpointSymbol | undefined;

        if (viewpoint) {
          const textWidth = 80;
          const textHeight = 55;
          const textX =
            position.x * tileSize < textWidth + PADDING
              ? position.x * tileSize + tileSize + PADDING
              : position.x * tileSize - textWidth - PADDING;
          const textY = position.y * tileSize;

          const lines: React.ReactNode[] = [];
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
            lines.push(
              <Line
                key={`${position.x},${position.y}-${direction}-1`}
                points={[start1.x, start1.y, end1.x, end1.y]}
                stroke={gradient}
                lineCap="round"
                strokeWidth={5}
              />
            );
            lines.push(
              <Line
                key={`${position.x},${position.y}-${direction}-2`}
                points={[start2.x, start2.y, end2.x, end2.y]}
                stroke={gradient}
                lineCap="round"
                strokeWidth={5}
              />
            );
          }

          return (
            <>
              {lines}
              <CanvasTextBox
                x={textX}
                y={textY}
                width={textWidth}
                height={textHeight}
                color={accentColor}
                text={`${count.completed}/${count.possible}`}
                fontSize={30}
              />
            </>
          );
        } else {
          const textWidth = 70;
          const textHeight = 50;
          const textX =
            position.x * tileSize < textWidth + PADDING
              ? position.x * tileSize + tileSize + PADDING
              : position.x * tileSize - textWidth - PADDING;
          const textY = position.y * tileSize;

          const positions: Position[] = [];
          grid.iterateArea(
            position,
            t => t.exists && t.color === tile.color,
            (_, x, y) => {
              positions.push({ x, y });
            }
          );
          return (
            <>
              {positions.map(({ x, y }) => (
                <Rect
                  key={`${x},${y}`}
                  x={x * tileSize}
                  y={y * tileSize}
                  width={tileSize}
                  height={tileSize}
                  fill={accentColor}
                  opacity={0.5}
                />
              ))}
              <CanvasTextBox
                x={textX}
                y={textY}
                width={textWidth}
                height={textHeight}
                color={accentColor}
                text={`${positions.length}`}
                fontSize={30}
              />
            </>
          );
        }
      }}
    </GridCanvasOverlay>
  );
});
