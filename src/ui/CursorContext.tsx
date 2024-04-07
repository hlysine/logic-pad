import { createContext, memo, useContext, useState } from 'react';
import { Color } from '../data/primitives';

interface CursorContext {
  left: Color;
  right: Color;
  setLeft: (value: Color) => void;
  setRight: (value: Color) => void;
}

const context = createContext<CursorContext>({
  left: Color.Dark,
  right: Color.Light,
  setLeft: () => {},
  setRight: () => {},
});

export const useCursor = () => {
  return useContext(context);
};

export default memo(function CursorContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [left, setLeft] = useState<Color>(Color.Dark);
  const [right, setRight] = useState<Color>(Color.Light);

  return (
    <context.Provider
      value={{
        left,
        right,
        setLeft,
        setRight
      }}
    >
      {children}
    </context.Provider>
  );
});
