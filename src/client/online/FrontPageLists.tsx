import { useQuery } from '@tanstack/react-query';
import { memo } from 'react';
import { api } from './api';
import HorizontalScroller from '../components/HorizontalScroller';
import PuzzleCard from './PuzzleCard';
import CollectionCard from './CollectionCard';
import Skeleton from '../components/Skeleton';

export default memo(function FrontPageLists() {
  const { data, isPending } = useQuery({
    queryKey: ['frontpage'],
    queryFn: api.getFrontPage,
  });
  return (
    <>
      <HorizontalScroller
        title="Newest puzzles"
        scrollable={false}
        className="flex-wrap box-content max-h-[calc(116px*2+1rem)] w-full"
        to="/search/puzzles"
      >
        {isPending
          ? Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="w-[320px] h-[116px]" />
            ))
          : data?.newestPuzzles.map(puzzle => (
              <PuzzleCard
                key={puzzle.id}
                puzzle={puzzle}
                expandable={false}
                to="/solve/$puzzleId"
                params={{ puzzleId: puzzle.id }}
              />
            ))}
      </HorizontalScroller>
      <HorizontalScroller
        title="Newest collections"
        scrollable={false}
        className="flex-wrap box-content max-h-[calc(96px*2+1rem)] w-full"
        to="/search/collections"
      >
        {isPending
          ? Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="w-[320px] h-[96px]" />
            ))
          : data?.newestCollections.map(collection => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                expandable={false}
                to="/collection/$collectionId"
                params={{ collectionId: collection.id }}
              />
            ))}
      </HorizontalScroller>
    </>
  );
});
