import { memo } from 'react';
import { FiCornerUpLeft, FiCornerUpRight, FiRefreshCcw } from 'react-icons/fi';
import { useGrid } from '../contexts/GridContext.tsx';
import { cn } from '../../client/uiHelper.ts';
import { useHotkeys } from 'react-hotkeys-hook';
import { useEdit } from '../contexts/EditContext.tsx';
import { useEmbed } from '../contexts/EmbedContext.tsx';
import { useSearch } from '@tanstack/react-router';
import { Serializer } from '@logic-pad/core/data/serializer/allSerializers';
import { Compressor } from '@logic-pad/core/data/serializer/compressor/allCompressors';
import GridData from '@logic-pad/core/data/grid';

export interface EditControlsProps {
  onReset?: () => void;
}

const EditControls = memo(function EditControls({
  onReset,
}: EditControlsProps) {
  const { grid, setGridRaw } = useGrid();
  const { undoStack, redoStack, undo: undoEdit, redo: redoEdit } = useEdit();
  const { embedChildren } = useEmbed();

  const undo = () => {
    const result = undoEdit(grid);
    if (result) setGridRaw(result);
  };

  const redo = () => {
    const result = redoEdit(grid);
    if (result) setGridRaw(result);
  };

  const restart = () => {
    onReset?.();
  };

  useHotkeys('z', undo, {
    preventDefault: true,
    enabled: embedChildren.length === 0,
    useKey: true,
  });
  useHotkeys('r', restart, {
    preventDefault: true,
    enabled: embedChildren.length === 0,
    useKey: true,
  });
  useHotkeys('y', redo, {
    preventDefault: true,
    enabled: embedChildren.length === 0,
    useKey: true,
  });

  return (
    <ul className="menu menu-horizontal shrink-0 justify-center bg-base-100 shadow-md text-base-content rounded-box fixed bottom-2 z-40 left-2 right-28 xl:static xl:shadow-md">
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

export default EditControls;

export function SolveEditControls() {
  const { grid, setGrid } = useGrid();
  const search = useSearch({ from: undefined, strict: false });
  return (
    <EditControls
      onReset={async () => {
        let newGrid: GridData;
        if ('d' in search && search.d) {
          newGrid = grid.withTiles(
            Serializer.parsePuzzle(await Compressor.decompress(search.d)).grid
              .tiles
          );
        } else {
          newGrid = grid.resetTiles();
        }
        if (newGrid.equals(grid)) return;
        setGrid(newGrid);
      }}
    />
  );
}

export function EditorEditControls() {
  const { grid, setGrid } = useGrid();
  return (
    <EditControls
      onReset={() => {
        const newGrid = grid.resetTiles();
        if (newGrid.equals(grid)) return;
        setGrid(newGrid);
      }}
    />
  );
}

export interface PerfectionEditControlsProps {
  onReset?: () => void;
}

export function PerfectionEditControls({
  onReset,
}: PerfectionEditControlsProps) {
  const { grid, setGridRaw } = useGrid();
  const { clearHistory } = useEdit();
  const search = useSearch({ from: undefined, strict: false });

  if (onReset) return <EditControls onReset={onReset} />;

  return (
    <EditControls
      onReset={async () => {
        let newGrid: GridData;
        if ('d' in search && search.d) {
          newGrid = grid.withTiles(
            Serializer.parsePuzzle(await Compressor.decompress(search.d)).grid
              .tiles
          );
        } else {
          newGrid = grid.resetTiles();
        }
        if (newGrid.equals(grid)) return;
        setGridRaw(newGrid);
        clearHistory(newGrid);
      }}
    />
  );
}
