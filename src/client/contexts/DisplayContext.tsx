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
  scale: externalScale,
  setScale: setExternalScale,
}: {
  children: React.ReactNode;
  scale?: number;
  setScale?: (value: number) => void;
}) {
  const [internalScale, setInternalScale] = useState(1);
  const scale = externalScale ?? internalScale;
  const setScale = setExternalScale ?? setInternalScale;

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
