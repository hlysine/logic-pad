import { createContext, memo, useContext, useEffect, useState } from 'react';

interface Features {
  instructions: boolean;
  metadata: boolean;
  checklist: boolean;
}

interface EmbedContext {
  features: Features;
  embedChildren: string[];
  setFeatures: (value: Features) => void;
  setEmbedChildren: (value: string[]) => void;
}

const context = createContext<EmbedContext>({
  features: {
    instructions: true,
    metadata: true,
    checklist: true,
  },
  embedChildren: [],
  setFeatures: () => {},
  setEmbedChildren: () => {},
});

export const useEmbed = () => {
  return useContext(context);
};

export const EmbedConsumer = context.Consumer;

export default memo(function EmbedContext({
  name,
  children,
  features: initialFeatures,
}: {
  name: string;
  children: React.ReactNode;
  features?: Features | (() => Features);
}) {
  const [features, setFeatures] = useState<Features>(
    initialFeatures ?? {
      instructions: true,
      metadata: true,
      checklist: true,
    }
  );
  const { embedChildren, setEmbedChildren } = useEmbed();
  const [embedChildrenOnSelf, setEmbedChildrenOnSelf] = useState<string[]>([]);

  useEffect(() => {
    if (!embedChildren.includes(name)) {
      setEmbedChildren([...embedChildren, name]);
    }
    return () => {
      if (embedChildren.includes(name)) {
        setEmbedChildren(embedChildren.filter(k => k !== name));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <context.Provider
      value={{
        features,
        setFeatures,
        embedChildren: embedChildrenOnSelf,
        setEmbedChildren: setEmbedChildrenOnSelf,
      }}
    >
      {children}
    </context.Provider>
  );
});
