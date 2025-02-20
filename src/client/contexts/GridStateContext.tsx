import { createContext, memo, useContext, useState } from 'react';
import { GridState, State } from '@logic-pad/core/data/primitives';

interface GridStateContext {
  state: GridState;
  revealSpoiler: boolean;
  setState: (value: GridState) => void;
  setRevealSpoiler: (value: boolean) => void;
}

export const defaultState: GridState = {
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
  state: externalState,
  setState: setExternalState,
}: {
  children: React.ReactNode;
  state?: GridState;
  setState?: (value: GridState) => void;
}) {
  const [internalState, setInternalState] = useState(defaultState);
  const [revealSpoiler, setRevealSpoiler] = useState(false);

  const state = externalState ?? internalState;
  const setState = setExternalState ?? setInternalState;

  const setStateAndReveal = (value: GridState) => {
    setState(value);
    if (State.isSatisfied(value.final)) {
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
