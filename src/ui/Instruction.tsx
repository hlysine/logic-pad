import InstructionData from '../data/instruction';
import { Errors } from '../data/primitives';
import { cn } from '../utils';
import Grid from './Grid';
import { instructionBg } from './helper';

export interface InstructionProps {
  instruction: InstructionData;
  errors?: Errors | null | undefined;
}

function AnnotatedText({ text }: { text: string }) {
  const parts = text.split('*');
  return (
    <span>
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          return (
            <span key={i} className="text-accent font-bold">
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

export default function Instruction({ instruction, errors }: InstructionProps) {
  return (
    <div className="flex flex-col w-[320px] items-stretch">
      <div
        className={cn(
          'relative flex m-0 border-0 pr-2',
          instructionBg(errors === undefined ? null : !errors)
        )}
      >
        <div className="text-center py-1 px-4 flex justify-center items-center text-neutral-content">
          <AnnotatedText text={instruction.explanation} />
        </div>
        <div className="shrink-0">
          <Grid size={28} grid={instruction.exampleGrid} editable={false} />
        </div>
      </div>
      <div className="h-[1px] bg-accent"></div>
    </div>
  );
}
