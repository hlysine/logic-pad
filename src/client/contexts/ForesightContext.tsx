import { createContext, memo, useContext, useState } from 'react';
import { Position } from '@logic-pad/core/data/primitives.js';
import GridData from '@logic-pad/core/data/grid.js';

interface ForesightContext {
  grid: GridData | null;
  position: Position | null;
  message: string | null;
  setForesight: (
    grid: GridData | null,
    position: Position | null,
    message: string | null
  ) => void;
}

const context = createContext<ForesightContext>({
  grid: null,
  position: null,
  message: '',
  setForesight: () => {},
});

export const useForesight = () => {
  return useContext(context);
};

export const ForesightConsumer = context.Consumer;

export default memo(function ForesightContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [grid, setGrid] = useState<GridData | null>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const [message, setMessage] = useState<string | null>('');

  const setForesight = (
    grid: GridData | null,
    position: Position | null,
    message: string | null
  ) => {
    setGrid(grid);
    setPosition(position);
    setMessage(message);
  };

  return (
    <context.Provider
      value={{
        grid,
        position,
        message,
        setForesight,
      }}
    >
      {children}
    </context.Provider>
  );
});
