import { createContext, useContext, useState } from 'react';
import GridData from '../data/grid';

interface EditContext {
  undoStack: GridData[];
  redoStack: GridData[];
  undo: (grid: GridData) => GridData | undefined;
  redo: (grid: GridData) => GridData | undefined;
  recordEdit: (grid: GridData) => void;
}

const context = createContext<EditContext>({
  undoStack: [],
  redoStack: [],
  undo: () => undefined,
  redo: () => undefined,
  recordEdit: () => {},
});

export const useEdit = () => {
  return useContext(context);
};

export default function EditContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [undoStack, setUndoStack] = useState<GridData[]>([]);
  const [redoStack, setRedoStack] = useState<GridData[]>([]);
  const [lastGrid, setLastGrid] = useState<GridData | null>(null);

  const recordEdit = (grid: GridData) => {
    if (lastGrid === null) {
      setLastGrid(grid);
      return;
    }
    if (lastGrid === grid) return;
    setUndoStack([...undoStack, lastGrid]);
    setLastGrid(grid);
    setRedoStack([]);
  };

  const undo = (grid: GridData) => {
    const last = undoStack.pop();
    if (!last) return;
    setRedoStack([...redoStack, grid]);
    setLastGrid(last);
    return last;
  };

  const redo = (grid: GridData) => {
    const next = redoStack.pop();
    if (!next) return;
    setUndoStack([...undoStack, grid]);
    setLastGrid(next);
    return next;
  };

  return (
    <context.Provider
      value={{
        undoStack,
        redoStack,
        undo,
        redo,
        recordEdit,
      }}
    >
      {children}
    </context.Provider>
  );
}
