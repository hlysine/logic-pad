import { createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import useOnlineLinkLoader from '../router/onlineLinkLoader';
import { puzzleSolveQueryOptions } from './_layout.solve.$puzzleId';
import MainContext from '../router/MainContext';
import PerfectionScreen from '../screens/PerfectionScreen';
import SolveModeButton from '../components/quickActions/SolveModeButton';
import { instance as foresightInstance } from '@logic-pad/core/data/rules/foresightRule';
import PerfectionRule from '@logic-pad/core/data/rules/perfectionRule';
import { useRouteProtection } from '../router/useRouteProtection';
import CollectionSidebar from '../online/CollectionSidebar';

export const Route = createLazyFileRoute('/_layout/perfection/$puzzleId')({
  component: memo(function OnlinePerfectionMode() {
    useRouteProtection('online');
    const search = Route.useSearch();
    const { data } = useSuspenseQuery(
      puzzleSolveQueryOptions(Route.useParams().puzzleId)
    );
    const result = useOnlineLinkLoader('perfection-online', data, {
      modifyPuzzle: puzzle => {
        puzzle.grid = puzzle.grid.withRules(rules => [
          new PerfectionRule(),
          ...rules.filter(r => r.id !== foresightInstance.id),
        ]);
        puzzle.solution =
          puzzle.solution?.withRules(rules => [
            new PerfectionRule(),
            ...rules.filter(r => r.id !== foresightInstance.id),
          ]) ?? null;
        return puzzle;
      },
    });
    return (
      <MainContext
        puzzleId={result.puzzleId}
        puzzle={data}
        initialPuzzle={result.initialPuzzle}
      >
        <PerfectionScreen
          quickActions={[<SolveModeButton key="-solveModeButton" />]}
          topLeft={<CollectionSidebar collectionId={search.collection} />}
        />
      </MainContext>
    );
  }),
});
