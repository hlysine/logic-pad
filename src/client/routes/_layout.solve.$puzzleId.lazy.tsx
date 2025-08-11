import { createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import SolveScreen from '../screens/SolveScreen';
import PerfectionModeLink from '../components/quickActions/PerfectionModeButton';
import { useSuspenseQuery } from '@tanstack/react-query';
import useOnlineLinkLoader from '../router/onlineLinkLoader';
import { puzzleSolveQueryOptions } from './_layout.solve.$puzzleId';
import MainContext from '../router/MainContext';

export const Route = createLazyFileRoute('/_layout/solve/$puzzleId')({
  component: memo(function OnlineSolveMode() {
    const { data } = useSuspenseQuery(
      puzzleSolveQueryOptions(Route.useParams().puzzleId)
    );
    const result = useOnlineLinkLoader(data);
    return (
      <MainContext
        puzzleId={result.puzzleId}
        puzzle={data}
        initialPuzzle={result.initialPuzzle}
      >
        <SolveScreen
          quickActions={[<PerfectionModeLink key="perfectionModeLink" />]}
        />
      </MainContext>
    );
  }),
});
