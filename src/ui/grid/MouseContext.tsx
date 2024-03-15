import { createContext, useContext, useState } from 'react';
import { Color } from '../../data/primitives';

interface MouseContext {
  color: Color | null;
  replacing: boolean;
  setColor: (color: Color | null, replacing: boolean) => void;
}

const context = createContext<MouseContext>({
  color: null,
  replacing: false,
  setColor: () => {},
});

export const useMouseContext = () => {
  return useContext(context);
};

export default function MouseContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [color, setColor] = useState(null as Color | null);
  const [replacing, setReplacing] = useState(false);
  return (
    <context.Provider
      value={{
        color,
        replacing,
        setColor: (color, replacing) => {
          setColor(color);
          setReplacing(replacing);
        },
      }}
    >
      {children}
    </context.Provider>
  );
}
