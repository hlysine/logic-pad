import { createContext, memo, useContext, useState } from 'react';
import { GridState, State } from '../data/primitives';

interface GridStateContext {
  state: GridState;
  setState: (value: GridState) => void;
}

const defaultState: GridState = {
  final: State.Incomplete,
  rules: [],
  symbols: new Map(),
};

const context = createContext<GridStateContext>({
  state: defaultState,
  setState: () => {},
});

export const useGridState = () => {
  return useContext(context);
};

export const GridStateConsumer = context.Consumer;

export default memo(function GridStateContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState(defaultState);

  return (
    <context.Provider
      value={{
        state,
        setState,
      }}
    >
      {children}
    </context.Provider>
  );
});
