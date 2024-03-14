import InstructionData from '../data/instruction';
import Grid from './Grid';

export interface InstructionProps {
  instruction: InstructionData;
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

export default function Instruction({ instruction }: InstructionProps) {
  return (
    <div className="flex flex-col w-[320px] items-stretch">
      <div className="flex bg-primary bg-opacity-10 m-0 border-0 pr-2">
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
