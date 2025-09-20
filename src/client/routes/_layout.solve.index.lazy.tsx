import { createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import useLinkLoader from '../router/linkLoader';
import SolveScreen from '../screens/SolveScreen';
import PerfectionModeLink from '../components/quickActions/PerfectionModeButton';
import MainContext from '../router/MainContext';

export const Route = createLazyFileRoute('/_layout/solve/')({
  component: memo(function SolveMode() {
    const result = useLinkLoader('solve-offline', { allowEmpty: false });

    return (
      <MainContext
        puzzleId={result.puzzleId}
        puzzle={null}
        initialPuzzle={result.initialPuzzle}
      >
        <SolveScreen
          quickActions={[<PerfectionModeLink key="perfectionModeLink" />]}
        />
      </MainContext>
    );
  }),
});
