import { createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import SolveScreen from '../screens/SolveScreen';
import PerfectionModeButton from '../components/quickActions/PerfectionModeButton';
import { useSuspenseQuery } from '@tanstack/react-query';
import useOnlineLinkLoader from '../router/onlineLinkLoader';
import { puzzleSolveQueryOptions } from './_layout.solve.$puzzleId';
import MainContext from '../router/MainContext';
import { useRouteProtection } from '../router/useRouteProtection';
import CollectionSidebar from '../online/CollectionSidebar';

export const Route = createLazyFileRoute('/_layout/solve/$puzzleId')({
  component: memo(function OnlineSolveMode() {
    const search = Route.useSearch();
    useRouteProtection('online');
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
          quickActions={[<PerfectionModeButton key="perfectionModeButton" />]}
          topLeft={
            <CollectionSidebar collectionId={search.collection ?? null} />
          }
        />
      </MainContext>
    );
  }),
});
