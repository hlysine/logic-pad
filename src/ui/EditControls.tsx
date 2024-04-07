import { memo } from 'react';
import { FiCornerUpLeft, FiCornerUpRight, FiRefreshCcw } from 'react-icons/fi';
import { useGrid } from './GridContext';
import { cn } from '../utils';
import { useHotkeys } from 'react-hotkeys-hook';
import { useEdit } from './EditContext';
import { Color, ColorClasses } from '../data/primitives';
import { useCursor } from './CursorContext';
import { color } from './helper';

export default memo(function EditControls() {
  const { grid, setGrid, setGridRaw } = useGrid();
  const { undoStack, redoStack, undo: undoEdit, redo: redoEdit } = useEdit();
  const { left, right, setLeft, setRight } = useCursor();

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

  // TODO: @Meldiron New color OK
  const buttons = [
    {
      classes: ColorClasses.Dark,
      value: Color.Dark,
    },
    {
      classes: ColorClasses.Light,
      value: Color.Light,
    },
    {
      classes: ColorClasses.Red,
      value: Color.Red,
    },
    {
      classes: ColorClasses.Orange,
      value: Color.Orange,
    },
    {
      classes: ColorClasses.Yellow,
      value: Color.Yellow,
    },
    {
      classes: ColorClasses.Lime,
      value: Color.Lime,
    },
    {
      classes: ColorClasses.Green,
      value: Color.Green,
    },
    {
      classes: ColorClasses.Teal,
      value: Color.Teal,
    },
    {
      classes: ColorClasses.Cyan,
      value: Color.Cyan,
    },
    {
      classes: ColorClasses.Blue,
      value: Color.Blue,
    },
    {
      classes: ColorClasses.Sky,
      value: Color.Sky,
    },
    {
      classes: ColorClasses.Indigo,
      value: Color.Indigo,
    },
    {
      classes: ColorClasses.Slate,
      value: Color.Slate,
    },
    {
      classes: ColorClasses.Purple,
      value: Color.Purple,
    },
  ];

  return (
    <div>
      <ul className="menu menu-horizontal justify-center bg-base-100 shadow-md rounded-box w-full mb-3 flex gap-3">
        {buttons.map(btn => (
          <li>
            <button
              onMouseDown={e => {
                e.preventDefault();

                let c = color(e.buttons);

                if (c === 'dark') {
                  setLeft(btn.value);
                }
                if (c === 'light') {
                  setRight(btn.value);
                }
              }}
              className={`rounded-lg cursor-pointer w-[2em] h-[2em] flex items-center text-xl justify-center font-bolder ${btn.classes}`}
            >
              {btn.value === left && 'L'}
              {btn.value === right && 'R'}
            </button>
          </li>
        ))}
      </ul>
      <ul className="menu menu-horizontal justify-center bg-base-100 shadow-md text-base-content rounded-box w-full">
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
    </div>
  );
});
