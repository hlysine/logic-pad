import { useSuspenseQuery } from '@tanstack/react-query';
import { memo } from 'react';
import { api } from './api';
import HorizontalScroller from '../components/HorizontalScroller';
import { useNavigate } from '@tanstack/react-router';
import PuzzleCard from './PuzzleCard';
import CollectionCard from './CollectionCard';

export default memo(function FrontPageLists() {
  const navigate = useNavigate();
  const { data } = useSuspenseQuery({
    queryKey: ['frontpage'],
    queryFn: api.getFrontPage,
  });
  return (
    <>
      <HorizontalScroller
        title="Newest puzzles"
        scrollable={false}
        className="flex-wrap box-content max-h-[calc(116px*2+1rem)] w-full"
        onExpand={async () => {
          await navigate({
            to: '/search/puzzles',
          });
        }}
      >
        {data.newestPuzzles.map(puzzle => (
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
        onExpand={async () => {
          await navigate({
            to: '/search/collections',
          });
        }}
      >
        {data.newestCollections.map(collection => (
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
