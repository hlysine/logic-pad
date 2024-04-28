import { memo } from 'react';
import { FiCornerUpLeft, FiCornerUpRight, FiRefreshCcw } from 'react-icons/fi';
import { useGrid } from './GridContext';
import { cn } from '../utils';
import { useHotkeys } from 'react-hotkeys-hook';
import { useEdit } from './EditContext';

export default memo(function EditControls() {
  const { grid, setGrid, setGridRaw } = useGrid();
  const { undoStack, redoStack, undo: undoEdit, redo: redoEdit } = useEdit();

  const undo = () => {
    const result = undoEdit(grid);
    if (result) setGridRaw(result);
  };

  const redo = () => {
    const result = redoEdit(grid);
    if (result) setGridRaw(result);
  };

  const restart = () => {
    const reset = grid.resetTiles();
    if (reset === grid) return;
    setGrid(reset);
  };

  useHotkeys('z', undo);
  useHotkeys('r', restart);
  useHotkeys('y', redo);

  return (
    <ul className="menu menu-horizontal justify-center bg-base-100 shadow-md text-base-content rounded-box w-full">
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
