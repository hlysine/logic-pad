import { memo, useMemo } from 'react';
import GridData from '../../data/grid';
import Tile from './Tile';
import MouseContext from './MouseContext';
import { Color } from '../../data/primitives';
import { array } from '../../data/helper';

export interface GridProps {
  size: number;
  grid: GridData;
  editable: boolean;
  onTileClick?: (x: number, y: number, target: Color, flood: boolean) => void;
  children?: React.ReactNode;
}

export default memo(function Grid({
  size,
  grid,
  editable,
  onTileClick,
  children,
}: GridProps) {
  const containerStyle = useMemo(
    () => ({
      width: `${size * grid.width}px`,
      height: `${size * grid.height}px`,
      minWidth: `${size * grid.width}px`,
      minHeight: `${size * grid.height}px`,
      fontSize: `${size}px`,
    }),
    [size, grid.width, grid.height]
  );
  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${grid.width}, ${size}px)`,
      gridTemplateRows: `repeat(${grid.height}, ${size}px)`,
    }),
    [grid.width, grid.height, size]
  );
  const tileConnections = useMemo(
    () =>
      array(grid.width, grid.height, (x, y) =>
        grid.connections.getForTile({ x, y })
      ),
    [grid.connections, grid.width, grid.height]
  );
  const clickHandlers = useMemo(
    () =>
      array(
        grid.width,
        grid.height,
        (x, y) => (target: Color, flood: boolean) =>
          onTileClick?.(x, y, target, flood)
      ),
    [grid.width, grid.height, onTileClick]
  );

  let totalWidth = grid.tiles[0].length;
  let center = [];

  if (totalWidth % 2 === 0) {
    center.push(totalWidth / 2);
    center.push(totalWidth / 2 + 1);
  } else {
    center.push(Math.ceil(totalWidth / 2));
  }
  const header = [];

  console.log(center);
  
  for (let i = 1; i <= totalWidth; i++) {
    if (center.includes(i)) {
      header.push('C');
    } else {
      header.push('');
    }
  }

  return (
    <MouseContext>
      <div className="relative" style={containerStyle}>
      <div style={{
        ...gridStyle,
        'gridTemplateRows': 'auto !important'
      }} className='absolute bottom-full left-0 grid justify-center content-center'>
            {header.map((l, y) =>
              <div className='relative w-[0.7em] h-[0.2em] mx-[0.15em] z-[999] transform translate-y-[0.15em] rounded-full bg-white' style={{
                opacity: l === 'C' ? '100%' : '0%'
              }}></div>
            )}
          </div>
              
        <div
          className="grid justify-center content-center absolute inset-0"
          style={gridStyle}
        >
         
          {grid.tiles.map((row, y) =>
            row.map((tile, x) => (
              <Tile
                key={`${x},${y}`}
                data={tile}
                editable={editable}
                connections={tileConnections[y][x]}
                onTileClick={clickHandlers[y][x]}
              />
            ))
          )}
        </div>
        {children}
      </div>
    </MouseContext>
  );
});
