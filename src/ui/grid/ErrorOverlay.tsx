import { memo, useMemo } from 'react';
import { Position } from '../../data/primitives';
import { array } from '../../data/helper';
import { Line } from 'react-konva';
import { useTheme } from '../ThemeContext';
import GridCanvasOverlay from './GridCanvasOverlay';

export interface ErrorOverlayProps {
  positions: readonly (readonly Position[])[];
  width: number;
  height: number;
}

function positionsToGrid(positions: readonly Position[]) {
  let width = 0;
  let height = 0;
  for (const { x, y } of positions) {
    if (width === 0 || x > width) {
      width = x;
    }
    if (height === 0 || y > height) {
      height = y;
    }
  }
  const grid = array(width + 1, height + 1, () => false);
  for (const { x, y } of positions) {
    grid[y][x] = true;
  }
  return grid;
}

export default memo(function ErrorOverlay({
  positions,
  width,
  height,
}: ErrorOverlayProps) {
  const grid = useMemo(
    () => positions.map(list => positionsToGrid(list)),
    [positions]
  );
  const { theme } = useTheme();

  const errorColor = useMemo(
    () =>
      window.getComputedStyle(document.getElementsByClassName('text-error')[0])
        .color,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  return (
    <GridCanvasOverlay width={width} height={height} bleed={5}>
      {tileSize =>
        positions.flatMap((list, idx) =>
          list.flatMap(({ x, y }) =>
            [
              grid[idx][y - 1]?.[x] || (
                <Line
                  key={`${x},${y}-top`}
                  points={[
                    x * tileSize,
                    y * tileSize,
                    (x + 1) * tileSize,
                    y * tileSize,
                  ]}
                  stroke={errorColor}
                  lineCap="round"
                  strokeWidth={5}
                />
              ),
              grid[idx][y][x + 1] || (
                <Line
                  key={`${x},${y}-right`}
                  points={[
                    (x + 1) * tileSize,
                    y * tileSize,
                    (x + 1) * tileSize,
                    (y + 1) * tileSize,
                  ]}
                  stroke={errorColor}
                  lineCap="round"
                  strokeWidth={5}
                />
              ),
              grid[idx][y + 1]?.[x] || (
                <Line
                  key={`${x},${y}-bottom`}
                  points={[
                    x * tileSize,
                    (y + 1) * tileSize,
                    (x + 1) * tileSize,
                    (y + 1) * tileSize,
                  ]}
                  stroke={errorColor}
                  lineCap="round"
                  strokeWidth={5}
                />
              ),
              grid[idx][y][x - 1] || (
                <Line
                  key={`${x},${y}-left`}
                  points={[
                    x * tileSize,
                    y * tileSize,
                    x * tileSize,
                    (y + 1) * tileSize,
                  ]}
                  stroke={errorColor}
                  lineCap="round"
                  strokeWidth={5}
                />
              ),
            ].filter(Boolean)
          )
        )
      }
    </GridCanvasOverlay>
  );
});
