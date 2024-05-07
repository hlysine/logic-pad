import { createContext, memo, useContext, useState } from 'react';

interface DisplayContext {
  scale: number;
  setScale: (value: number) => void;
}

const context = createContext<DisplayContext>({
  scale: 1,
  setScale: () => {},
});

export const useDisplay = () => {
  return useContext(context);
};

export const DisplayConsumer = context.Consumer;

export default memo(function DisplayContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scale, setScale] = useState(1);

  return (
    <context.Provider
      value={{
        scale,
        setScale,
      }}
    >
      {children}
    </context.Provider>
  );
});
