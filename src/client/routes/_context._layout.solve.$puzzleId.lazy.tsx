import { createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import SolveScreen from '../screens/SolveScreen';
import PerfectionModeLink from '../components/PerfectionModeButton';
import { useSuspenseQuery } from '@tanstack/react-query';
import useOnlineLinkLoader from '../router/onlineLinkLoader';
import { puzzleSolveQueryOptions } from './_context._layout.solve.$puzzleId';

export const Route = createLazyFileRoute('/_context/_layout/solve/$puzzleId')({
  component: memo(function OnlineSolveMode() {
    const { data } = useSuspenseQuery(
      puzzleSolveQueryOptions(Route.useParams().puzzleId)
    );
    useOnlineLinkLoader(data);
    return (
      <SolveScreen
        quickActions={[<PerfectionModeLink key="perfectionModeLink" />]}
      />
    );
  }),
});
