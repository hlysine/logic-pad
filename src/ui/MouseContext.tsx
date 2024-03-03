import { createContext, useContext, useState } from 'react';
import { Color } from '../data/tile';

interface MouseContext {
  color: Color | null;
  setColor: React.Dispatch<React.SetStateAction<Color | null>>;
}

const context = createContext<MouseContext>({
  color: null,
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
  return (
    <context.Provider value={{ color, setColor }}>{children}</context.Provider>
  );
}
