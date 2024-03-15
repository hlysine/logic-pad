import GridData from '../data/grid';
import Instruction from './Instruction';
import { ValidationResult } from '../data/primitives';

export interface InstructionListProps {
  data: GridData;
  validation?: ValidationResult | undefined;
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <div className="uppercase w-36 text-center bg-secondary bg-opacity-10 text-neutral-content mt-4">
      {children}
    </div>
  );
}

export default function InstructionList({
  data,
  validation,
}: InstructionListProps) {
  return (
    <div className="flex flex-col items-end justify-center">
      {data.rules.length > 0 && <Title>Rules</Title>}
      {data.rules.map((rule, i) => (
        <Instruction
          key={rule.id + i}
          instruction={rule}
          errors={validation?.rules[i]}
        />
      ))}
      {data.symbols.size > 0 && <Title>Symbols</Title>}
      {[...data.symbols.keys()].map(key => (
        <Instruction
          key={key}
          instruction={data.symbols.get(key)![0]}
          errors={validation?.symbols.get(key)}
        />
      ))}
    </div>
  );
}
