import InstructionList from '../ui/instructions/InstructionList';
import EditControls from '../ui/EditControls';
import MainGrid from '../ui/grid/MainGrid';
import EditableInstruction from '../ui/instructions/EditableInstruction';
import RulerOverlay from '../ui/grid/RulerOverlay';
import { useGrid } from '../ui/GridContext';
import InstructionSearch from '../ui/instructions/InstructionSearch';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense, lazy, memo } from 'react';
import useLinkLoader, { validateSearch } from '../ui/router/linkLoader';
import Loading from '../ui/Loading';
import HorizontalLayout from '../ui/HorizontalLayout';
const SourceCodeEditor = lazy(
  () => import('../ui/codeEditor/SourceCodeEditor')
);

export const Route = createFileRoute('/create')({
  validateSearch,
  component: memo(function CreateMode() {
    const { grid } = useGrid();
    const params = Route.useSearch();
    useLinkLoader(params);

    return (
      <HorizontalLayout
        left={
          <>
            <Suspense fallback={<Loading />}>
              <SourceCodeEditor loading={<Loading />} />
            </Suspense>
            <EditControls />
          </>
        }
        center={
          <MainGrid editable={true}>
            <RulerOverlay width={grid.width} height={grid.height} />
          </MainGrid>
        }
        right={
          <>
            <InstructionSearch />
            <InstructionList>{EditableInstruction}</InstructionList>
          </>
        }
      />
    );
  }),
});
