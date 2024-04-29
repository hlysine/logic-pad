import { memo, useState } from 'react';
import { useGrid } from '../GridContext';
import { cn } from '../../utils';

export default memo(function GridSizeEditor() {
  const { grid, setGrid } = useGrid();
  const [width, setWidth] = useState(grid.width);
  const [height, setHeight] = useState(grid.height);
  return (
    <>
      <div className="flex gap-2">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Width</span>
          </div>
          <input
            type="number"
            min={0}
            step={1}
            className="input input-bordered w-full max-w-xs"
            value={width}
            onChange={e => setWidth(+e.target.value)}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Height</span>
          </div>
          <input
            type="number"
            min={0}
            step={1}
            className="input input-bordered w-full max-w-xs"
            value={height}
            onChange={e => setHeight(+e.target.value)}
          />
        </label>
      </div>
      <button
        className={cn(
          'btn btn-outline btn-info',
          (grid.width > width || grid.height > height) && 'btn-error'
        )}
        disabled={grid.width === width && grid.height === height}
        onClick={() => setGrid(grid.resize(width, height))}
      >
        Resize
      </button>
    </>
  );
});
