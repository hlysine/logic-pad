import { ReactNode, createContext, memo, useContext, useState } from 'react';
import { PartPlacement } from '../instructions/parts/types';

interface InstructionPartsContext {
  parts: ReadonlyMap<PartPlacement, ReactNode[]>;
  addPart: (placement: PartPlacement, part: ReactNode) => void;
  removePart: (placement: PartPlacement, part: ReactNode) => void;
}

const context = createContext<InstructionPartsContext>({
  parts: new Map(),
  addPart: () => {},
  removePart: () => {},
});

export const useInstructionParts = () => {
  return useContext(context);
};

export const InstructionPartsConsumer = context.Consumer;

export default memo(function InstructionPartsContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [parts, setParts] = useState<ReadonlyMap<PartPlacement, ReactNode[]>>(
    new Map()
  );

  const addPart = (placement: PartPlacement, part: ReactNode) => {
    setParts(oldParts => {
      const newParts = new Map(oldParts);
      const existing = newParts.get(placement) ?? [];
      newParts.set(placement, [...existing, part]);
      return newParts;
    });
  };

  const removePart = (placement: PartPlacement, part: ReactNode) => {
    setParts(oldParts => {
      const newParts = new Map(oldParts);
      const existing = newParts.get(placement);
      if (!existing) return oldParts;
      newParts.set(
        placement,
        existing.filter(existingPart => existingPart !== part)
      );
      return newParts;
    });
  };

  return (
    <context.Provider
      value={{
        parts,
        addPart,
        removePart,
      }}
    >
      {children}
    </context.Provider>
  );
});
