import { createContext, memo, use, useState } from 'react';
import { GridState, State } from '@logic-pad/core/data/primitives';

interface GridStateContext {
  state: GridState;
  setState: (value: GridState) => void;
}

export const defaultState: GridState = {
  final: State.Incomplete,
  rules: [],
  symbols: new Map(),
};

const Context = createContext<GridStateContext>({
  state: defaultState,
  setState: () => {},
});

export const useGridState = () => {
  return use(Context);
};

export const GridStateConsumer = Context.Consumer;

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

  const state = externalState ?? internalState;
  const setState = setExternalState ?? setInternalState;

  return (
    <Context
      value={{
        state,
        setState,
      }}
    >
      {children}
    </Context>
  );
});
