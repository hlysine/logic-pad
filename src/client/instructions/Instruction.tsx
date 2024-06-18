import { memo, useMemo } from 'react';
import InstructionData from '../../data/instruction';
import { State } from '../../data/primitives';
import { cn } from '../../client/uiHelper.ts';
import Grid from '../grid/Grid';
import SymbolOverlay from '../grid/SymbolOverlay';
import AnnotatedText from '../components/AnnotatedText';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface InstructionProps {
  id: string | number;
  editable: boolean;
  instruction: InstructionData;
  state?: State;
  children?: React.ReactNode;
  className?: string;
}

function instructionBg(state: State) {
  switch (state) {
    case State.Satisfied:
      return cn(
        'bg-gradient-to-r from-success/50 via-primary/10 to-primary/10'
      );
    case State.Error:
      return cn('bg-gradient-to-r from-error/50 via-primary/10 to-primary/10');
    default:
      return cn('bg-primary/10');
  }
}

export default memo(function Instruction({
  id,
  editable,
  instruction,
  state,
  children,
  className,
}: InstructionProps) {
  state = state ?? State.Incomplete;
  const exampleGrid = useMemo(
    () => instruction.createExampleGrid(),
    [instruction]
  );
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  return (
    <div
      ref={editable ? setNodeRef : null}
      style={
        editable
          ? {
              transform: CSS.Transform.toString(transform),
              transition,
            }
          : {}
      }
      {...(editable ? attributes : {})}
      {...(editable ? listeners : {})}
      className={cn(
        'flex flex-col w-[320px] items-stretch shrink-0',
        className
      )}
    >
      <div
        className={cn('relative flex m-0 border-0 pr-2', instructionBg(state))}
      >
        <div
          className={cn(
            'w-1 shrink-0 grow-0 transition-colors',
            state === State.Incomplete
              ? 'bg-opacity-0'
              : state === State.Satisfied
                ? 'bg-success'
                : 'bg-error'
          )}
        ></div>
        <div className="text-center py-1 px-4 flex grow justify-center items-center text-neutral-content">
          <AnnotatedText text={instruction.explanation} />
        </div>
        <div className="shrink-0 relative min-h-[calc(28px*4)] min-w-[calc(28px*5)] flex items-center justify-center">
          {exampleGrid && (
            <Grid
              type="canvas"
              size={
                exampleGrid.width === 1 && exampleGrid.height === 1 ? 56 : 28 // special case for rules with a single symbol as thumbnail
              }
              grid={exampleGrid}
              editable={false}
            >
              {exampleGrid.symbols.size > 0 ? (
                <SymbolOverlay grid={exampleGrid} />
              ) : null}
            </Grid>
          )}
        </div>
        {children}
      </div>
      <div className="h-[1px] bg-accent"></div>
    </div>
  );
});
