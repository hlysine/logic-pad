import { createContext, memo, useContext, useState } from 'react';
import Instruction from '../data/instruction';
import GridData from '../data/grid';
import Rule from '../data/rules/rule';
import Symbol from '../data/symbols/symbol';

export type InstructionLocation =
  | {
      type: 'rule';
      index: number;
    }
  | {
      type: 'symbol';
      id: string;
      index: number;
    };

export function getInstruction(grid: GridData, location: InstructionLocation) {
  if (location.type === 'rule') {
    return grid.rules[location.index];
  } else {
    const list = grid.symbols.get(location.id);
    if (!list) return undefined;
    return list[location.index];
  }
}

export function getInstructionLocation(
  grid: GridData,
  instruction: Instruction
): InstructionLocation | undefined {
  if (instruction instanceof Rule) {
    return {
      type: 'rule',
      index: grid.rules.indexOf(instruction),
    };
  } else if (instruction instanceof Symbol) {
    const list = grid.symbols.get(instruction.id);
    if (!list) return undefined;
    return {
      type: 'symbol',
      id: instruction.id,
      index: list.indexOf(instruction),
    };
  }
  return undefined;
}

interface ConfigContext {
  location: InstructionLocation | undefined;
  ref: React.RefObject<HTMLElement> | undefined;
  setLocation: (value: InstructionLocation | undefined) => void;
  setRef: (value: React.RefObject<HTMLElement> | undefined) => void;
}

const context = createContext<ConfigContext>({
  location: undefined,
  ref: undefined,
  setLocation: () => {},
  setRef: () => {},
});

export const useConfig = () => {
  return useContext(context);
};

export const ConfigConsumer = context.Consumer;

export default memo(function ConfigContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [location, setLocation] = useState<InstructionLocation | undefined>(
    undefined
  );
  const [ref, setRef] = useState<React.RefObject<HTMLElement> | undefined>(
    undefined
  );

  return (
    <context.Provider
      value={{
        location,
        ref,
        setLocation,
        setRef,
      }}
    >
      {children}
    </context.Provider>
  );
});
