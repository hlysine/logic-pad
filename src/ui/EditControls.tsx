import { memo } from 'react';
import { FiCornerUpLeft, FiCornerUpRight, FiRefreshCcw } from 'react-icons/fi';
import { useGrid } from './GridContext';
import { array } from '../data/helper';
import { Color } from '../data/primitives';
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
    let changed = false;
    const newTiles = array(grid.width, grid.height, (x, y) => {
      const tile = grid.getTile(x, y);
      if (tile.exists && !tile.fixed && tile.color !== Color.Gray) {
        changed = true;
        return tile.withColor(Color.Gray);
      }
      return tile;
    });
    if (!changed) return;
    setGrid(grid.copyWith({ tiles: newTiles }));
  };

  useHotkeys('z', undo);
  useHotkeys('r', restart);
  useHotkeys('y', redo);

  return (
    <ul className="menu menu-horizontal justify-center bg-base-200 rounded-box w-full">
      <li className={cn(undoStack.length === 0 && 'disabled')}>
        <a className="tooltip" data-tip="Undo (Z)" onClick={undo}>
          <FiCornerUpLeft />
        </a>
      </li>
      <li>
        <a className="tooltip" data-tip="Restart (R)" onClick={restart}>
          <FiRefreshCcw />
        </a>
      </li>
      <li className={cn(redoStack.length === 0 && 'disabled')}>
        <a className="tooltip" data-tip="Redo (Y)" onClick={redo}>
          <FiCornerUpRight />
        </a>
      </li>
    </ul>
  );
});
