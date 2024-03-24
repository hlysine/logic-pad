import { memo, useMemo } from 'react';
import { Position } from '../../data/primitives';
import GridOverlay from './GridOverlay';
import { array } from '../../data/helper';

export interface ErrorOverlayProps {
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

export default memo(function ErrorOverlay({ positions }: ErrorOverlayProps) {
  const grid = useMemo(() => positionsToGrid(positions), [positions]);
  return (
    <GridOverlay>
      {positions.map(({ x, y }) => (
        <div
          key={`${x},${y}`}
          className="absolute bg-transparent pointer-events-none border-error w-[1em] h-[1em]"
          style={{
            left: `calc(${x} * 1em)`,
            top: `calc(${y} * 1em)`,
            borderTopWidth: grid[y - 1]
              ? grid[y - 1][x]
                ? '0'
                : `0.125em`
              : `0.125em`,
            borderRightWidth: grid[y][x + 1] ? '0' : `0.125em`,
            borderBottomWidth: grid[y + 1]
              ? grid[y + 1][x]
                ? '0'
                : `0.125em`
              : `0.125em`,
            borderLeftWidth: grid[y][x - 1] ? '0' : `0.125em`,
          }}
        />
      ))}
    </GridOverlay>
  );
});
