import { memo } from 'react';
import { FiCornerUpLeft, FiCornerUpRight, FiRefreshCcw } from 'react-icons/fi';
import { useGrid } from '../contexts/GridContext.tsx';
import { cn } from '../../client/uiHelper.ts';
import { useHotkeys } from 'react-hotkeys-hook';
import { useEdit } from '../contexts/EditContext.tsx';
import { useSearch } from '@tanstack/react-router';
import { Compressor, GridData, Serializer } from '@logic-pad/core/index.ts';

export default memo(function EditControls() {
  const { grid, setGrid, setGridRaw } = useGrid();
  const { undoStack, redoStack, undo: undoEdit, redo: redoEdit } = useEdit();
  const search = useSearch({ from: undefined, strict: false });

  const undo = () => {
    const result = undoEdit(grid);
    if (result) setGridRaw(result);
  };

  const redo = () => {
    const result = redoEdit(grid);
    if (result) setGridRaw(result);
  };

  const restart = async () => {
    let reset: GridData;
    if ('d' in search && search.d) {
      reset = grid.withTiles(
        Serializer.parsePuzzle(await Compressor.decompress(search.d)).grid.tiles
      );
    } else {
      reset = grid.resetTiles();
    }
    if (reset === grid) return;
    setGrid(reset);
  };

  useHotkeys('z', undo, { preventDefault: true });
  useHotkeys('r', restart, { preventDefault: true });
  useHotkeys('y', redo, { preventDefault: true });

  return (
    <ul className="menu menu-horizontal shrink-0 justify-center bg-base-100 shadow-md text-base-content rounded-box fixed bottom-2 z-40 left-2 right-2 xl:static xl:shadow-md">
      <li className={cn(undoStack.length === 0 && 'disabled')}>
        <a className="tooltip tooltip-info" data-tip="Undo (Z)" onClick={undo}>
          <FiCornerUpLeft />
        </a>
      </li>
      <li>
        <a
          className="tooltip tooltip-info"
          data-tip="Restart (R)"
          onClick={restart}
        >
          <FiRefreshCcw />
        </a>
      </li>
      <li className={cn(redoStack.length === 0 && 'disabled')}>
        <a className="tooltip tooltip-info" data-tip="Redo (Y)" onClick={redo}>
          <FiCornerUpRight />
        </a>
      </li>
    </ul>
  );
});
