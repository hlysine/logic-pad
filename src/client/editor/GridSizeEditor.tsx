import { memo, useEffect, useState } from 'react';
import { cn } from '../../client/uiHelper.ts';
import GridData from '@logic-pad/core/data/grid';

export interface GridSizeEditorProps {
  grid: GridData;
  setGrid: (grid: GridData) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

function getButtonSize(size: GridSizeEditorProps['size']) {
  switch (size) {
    case 'xs':
      return 'btn-xs';
    case 'sm':
      return 'btn-sm';
    case 'md':
      return '';
    case 'lg':
      return 'btn-lg';
  }
}

function getInputSize(size: GridSizeEditorProps['size']) {
  switch (size) {
    case 'xs':
      return 'input-xs';
    case 'sm':
      return 'input-sm';
    case 'md':
      return '';
    case 'lg':
      return 'input-lg';
  }
}

export default memo(function GridSizeEditor({
  grid,
  setGrid,
  size,
}: GridSizeEditorProps) {
  size = size ?? 'md';
  const [width, setWidth] = useState(grid.width);
  const [height, setHeight] = useState(grid.height);

  useEffect(() => {
    setWidth(grid.width);
    setHeight(grid.height);
  }, [grid]);

  return (
    <div className="flex flex-col gap-2 tour-grid-size-editor">
      <div className="flex gap-2">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Width</span>
          </div>
          <input
            type="number"
            min="0"
            step={1}
            className={cn(
              'input input-bordered w-full max-w-xs min-w-0',
              getInputSize(size)
            )}
            value={width}
            onChange={e => {
              setWidth(Math.max(0, +e.target.value));
            }}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Height</span>
          </div>
          <input
            type="number"
            min="0"
            step={1}
            className={cn(
              'input input-bordered w-full max-w-xs min-w-0',
              getInputSize(size)
            )}
            value={height}
            onChange={e => {
              setHeight(Math.max(0, +e.target.value));
            }}
          />
        </label>
      </div>
      <button
        type="button"
        className={cn(
          'btn btn-outline btn-info',
          (grid.width > width || grid.height > height) && 'btn-error',
          getButtonSize(size)
        )}
        disabled={grid.width === width && grid.height === height}
        onClick={() => {
          setGrid(grid.resize(width, height));
        }}
      >
        Resize
      </button>
    </div>
  );
});
