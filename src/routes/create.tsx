import InstructionList from '../ui/instructions/InstructionList';
import EditControls from '../ui/components/EditControls';
import MainGrid from '../ui/grid/MainGrid';
import RulerOverlay from '../ui/grid/RulerOverlay';
import { useGrid } from '../ui/GridContext';
import InstructionSearch from '../ui/instructions/InstructionSearch';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense, lazy, memo } from 'react';
import useLinkLoader, { validateSearch } from '../ui/router/linkLoader';
import Loading from '../ui/components/Loading';
import ThreePaneLayout from '../ui/ThreePaneLayout';
import DocumentTitle from '../ui/components/DocumentTitle';
import TouchControls from '../ui/components/TouchControls';
import ConfigContext from '../ui/ConfigContext';
import ConfigPopup from '../ui/configs/ConfigPopup';
const SourceCodeEditor = lazy(
  () => import('../ui/codeEditor/SourceCodeEditor')
);

export const Route = createFileRoute('/create')({
  validateSearch,
  component: memo(function CreateMode() {
    const { grid } = useGrid();
    const params = Route.useSearch();
    useLinkLoader(params, true);

    return (
      <ConfigContext>
        <ThreePaneLayout
          left={
            <>
              <DocumentTitle>Puzzle Editor - Logic Pad</DocumentTitle>
              <Suspense fallback={<Loading />}>
                <SourceCodeEditor loading={<Loading />} />
              </Suspense>
              <TouchControls />
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
              <InstructionList editable={true} />
              <ConfigPopup />
            </>
          }
        />
      </ConfigContext>
    );
  }),
});
