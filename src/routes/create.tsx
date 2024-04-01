import InstructionList from '../ui/instructions/InstructionList';
import EditControls from '../ui/EditControls';
import MainGrid from '../ui/grid/MainGrid';
import EditableInstruction from '../ui/instructions/EditableInstruction';
import RulerOverlay from '../ui/grid/RulerOverlay';
import { useGrid } from '../ui/GridContext';
import InstructionSearch from '../ui/instructions/InstructionSearch';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense, lazy, memo } from 'react';
import LinkLoader, { validateSearch } from '../ui/router/LinkLoader';
import Loading from '../ui/Loading';
const SourceCodeEditor = lazy(
  () => import('../ui/codeEditor/SourceCodeEditor')
);

export const Route = createFileRoute('/create')({
  validateSearch,
  component: memo(function CreateMode() {
    const { grid } = useGrid();
    const params = Route.useSearch();

    return (
      <div className="flex flex-1 justify-center items-center flex-wrap">
        <LinkLoader params={params} />
        <div className="w-[320px] flex flex-col p-4 gap-4 text-neutral-content self-stretch justify-between">
          <Suspense fallback={<Loading />}>
            <SourceCodeEditor loading={<Loading />} />
          </Suspense>
          <EditControls />
        </div>
        <div className="grow shrink flex justify-start items-center p-0">
          <div className="flex shrink-0 grow justify-center items-center m-0 p-0 border-0">
            <MainGrid editable={true}>
              <RulerOverlay width={grid.width} height={grid.height} />
            </MainGrid>
          </div>
        </div>
        <div className="flex flex-col items-stretch self-stretch justify-center gap-4">
          <InstructionSearch />
          <InstructionList>{EditableInstruction}</InstructionList>
        </div>
      </div>
    );
  }),
});
