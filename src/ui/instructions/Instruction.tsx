import { memo, useMemo } from 'react';
import InstructionData from '../../data/instruction';
import { State } from '../../data/primitives';
import { cn } from '../../utils';
import Grid from '../grid/Grid';
import { instructionBg } from '../helper';
import SymbolOverlay from '../grid/SymbolOverlay';
import AnnotatedText from './AnnotatedText';

export interface InstructionProps {
  instruction: InstructionData;
  index: number | null;
  state?: State;
}

export default memo(function Instruction({
  instruction,
  state,
}: InstructionProps) {
  state = state ?? State.Incomplete;
  const exampleGrid = useMemo(() => instruction.exampleGrid, [instruction]);
  return (
    <div className="flex flex-col w-[320px] items-stretch">
      <div
        className={cn('relative flex m-0 border-0 pr-2', instructionBg(state))}
      >
        <div
          className={cn(
            'w-1 shrink-0 grow-0',
            state === State.Incomplete
              ? 'bg-opacity-0'
              : state === State.Satisfied
                ? 'bg-success'
                : 'bg-error'
          )}
        ></div>
        <div className="text-center py-1 px-4 flex justify-center items-center text-neutral-content">
          <AnnotatedText text={instruction.explanation} />
        </div>
        <div className="shrink-0">
          <Grid size={28} grid={exampleGrid} editable={false}>
            {exampleGrid.symbols.size > 0 ? (
              <SymbolOverlay size={28} grid={exampleGrid} />
            ) : null}
          </Grid>
        </div>
      </div>
      <div className="h-[1px] bg-accent"></div>
    </div>
  );
});
