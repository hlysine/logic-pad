import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Position } from '../../data/primitives';
import GridOverlay from './GridOverlay';
import { array } from '../../data/helper';
import { Layer, Line, Stage } from 'react-konva';

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
  const overlayRef = useRef<HTMLDivElement>(null);
  const [tileSize, setTileSize] = useState(0);

  useEffect(() => {
    if (overlayRef.current) {
      const { current } = overlayRef;
      const resizeHandler = (e: UIEvent) => {
        const divWidth = (e.currentTarget as HTMLDivElement).offsetWidth;
        setTileSize(divWidth / width);
      };
      resizeHandler({
        currentTarget: overlayRef.current,
      } as unknown as UIEvent);
      current.addEventListener('resize', resizeHandler);
      return () => current.removeEventListener('resize', resizeHandler);
    }
  }, [width]);

  return (
    <GridOverlay ref={overlayRef}>
      <Stage
        width={width * tileSize + 10}
        height={height * tileSize + 10}
        className="absolute -top-[5px] -left-[5px]"
      >
        <Layer offsetX={-5} offsetY={-5}>
          {positions.flatMap((list, idx) =>
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
                    stroke="red"
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
                    stroke="red"
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
                    stroke="red"
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
                    stroke="red"
                    lineCap="round"
                    strokeWidth={5}
                  />
                ),
              ].filter(Boolean)
            )
          )}
        </Layer>
      </Stage>
    </GridOverlay>
  );
});
