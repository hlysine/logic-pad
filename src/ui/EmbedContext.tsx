import { createContext, memo, useContext, useState } from 'react';

interface Features {
  instructions: boolean;
  metadata: boolean;
}

interface EmbedContext {
  features: Features;
  setFeatures: (value: Features) => void;
}

const context = createContext<EmbedContext>({
  features: {
    instructions: true,
    metadata: true,
  },
  setFeatures: () => {},
});

export const useEmbed = () => {
  return useContext(context);
};

export const EmbedConsumer = context.Consumer;

export default memo(function EmbedContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [features, setFeatures] = useState<Features>({
    instructions: true,
    metadata: true,
  });

  return (
    <context.Provider
      value={{
        features,
        setFeatures,
      }}
    >
      {children}
    </context.Provider>
  );
});
