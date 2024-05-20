import { createContext, memo, useContext, useState } from 'react';
import { GridState, State } from '../data/primitives';

interface GridStateContext {
  state: GridState;
  revealSpoiler: boolean;
  setState: (value: GridState) => void;
  setRevealSpoiler: (value: boolean) => void;
}

const defaultState: GridState = {
  final: State.Incomplete,
  rules: [],
  symbols: new Map(),
};

const context = createContext<GridStateContext>({
  state: defaultState,
  revealSpoiler: false,
  setState: () => {},
  setRevealSpoiler: () => {},
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
  const [revealSpoiler, setRevealSpoiler] = useState(false);

  const setStateAndReveal = (value: GridState) => {
    setState(value);
    if (value.final === State.Satisfied) {
      setRevealSpoiler(true);
    }
  };

  return (
    <context.Provider
      value={{
        state,
        revealSpoiler,
        setState: setStateAndReveal,
        setRevealSpoiler,
      }}
    >
      {children}
    </context.Provider>
  );
});
