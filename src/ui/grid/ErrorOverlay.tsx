import { memo, useMemo } from 'react';
import { Position } from '../../data/primitives';
import GridOverlay from './GridOverlay';
import { array } from '../../data/helper';

export interface ErrorOverlayProps {
  size: number;
  positions: readonly Position[];
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
  size,
  positions,
}: ErrorOverlayProps) {
  const grid = useMemo(() => positionsToGrid(positions), [positions]);
  return (
    <GridOverlay>
      {positions.map(({ x, y }) => (
        <div
          key={`${x},${y}`}
          className="absolute bg-transparent pointer-events-none border-error"
          style={{
            left: `${x * size}px`,
            top: `${y * size}px`,
            width: `${size}px`,
            height: `${size}px`,
            borderTopWidth: grid[y - 1]
              ? grid[y - 1][x]
                ? '0'
                : `${size / 8}px`
              : `${size / 8}px`,
            borderRightWidth: grid[y][x + 1] ? '0' : `${size / 8}px`,
            borderBottomWidth: grid[y + 1]
              ? grid[y + 1][x]
                ? '0'
                : `${size / 8}px`
              : `${size / 8}px`,
            borderLeftWidth: grid[y][x - 1] ? '0' : `${size / 8}px`,
          }}
        />
      ))}
    </GridOverlay>
  );
});
