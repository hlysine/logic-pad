import { useMemo } from 'react';
import GridData from '../data/grid';
import Instruction from './Instruction';
import Symbol from '../data/symbols/symbol';

export interface InstructionListProps {
  data: GridData;
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <div className="uppercase w-36 text-center bg-secondary bg-opacity-10 text-neutral-content mt-4">
      {children}
    </div>
  );
}

export default function InstructionList({ data }: InstructionListProps) {
  const symbols = useMemo(() => {
    const symbolMap = new Map<string, Symbol>();
    data.symbols.forEach(symbol => {
      symbolMap.set(symbol.id, symbol);
    });
    return [...symbolMap.values()];
  }, [data.symbols]);
  return (
    <div className="flex flex-col items-end justify-center">
      {data.rules.length > 0 && <Title>Rules</Title>}
      {data.rules.map((rule, i) => (
        <Instruction key={rule.id + i} instruction={rule} />
      ))}
      {symbols.length > 0 && <Title>Symbols</Title>}
      {symbols.map(symbol => (
        <Instruction key={symbol.id} instruction={symbol} />
      ))}
    </div>
  );
}
