import { createContext, memo, useContext, useState } from 'react';

interface DisplayContext {
  scale: number;
  setScale: (value: number) => void;
  responsiveScale: boolean;
  setResponsiveScale: (value: boolean) => void;
}

const context = createContext<DisplayContext>({
  scale: 1,
  setScale: () => {},
  responsiveScale: true,
  setResponsiveScale: () => {},
});

export const useDisplay = () => {
  return useContext(context);
};

export const DisplayConsumer = context.Consumer;

export default memo(function DisplayContext({
  children,
  scale: externalScale,
  setScale: setExternalScale,
  responsiveScale: externalResponsiveScale,
  setResponsiveScale: setExternalResponsiveScale,
}: {
  children: React.ReactNode;
  scale?: number;
  setScale?: (value: number) => void;
  responsiveScale?: boolean;
  setResponsiveScale?: (value: boolean) => void;
}) {
  const [internalScale, setInternalScale] = useState(1);
  const scale = externalScale ?? internalScale;
  const setScale = setExternalScale ?? setInternalScale;

  const [internalResponsiveScale, setInternalResponsiveScale] = useState(true);
  const responsiveScale = externalResponsiveScale ?? internalResponsiveScale;
  const setResponsiveScale =
    setExternalResponsiveScale ?? setInternalResponsiveScale;

  return (
    <context.Provider
      value={{
        scale,
        setScale,
        responsiveScale,
        setResponsiveScale,
      }}
    >
      {children}
    </context.Provider>
  );
});
