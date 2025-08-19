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
        className="flex-wrap box-content h-[calc(116px*2+1rem)] xl:h-[116px] w-full"
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
            onClick={async () => {
              await navigate({ to: '/solve/' + puzzle.id });
            }}
          />
        ))}
      </HorizontalScroller>
      <HorizontalScroller
        title="Newest collections"
        scrollable={false}
        className="flex-wrap box-content h-[calc(96px*2+1rem)] xl:h-[96px] w-full"
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
            onClick={async () => {
              await navigate({ to: '/collection/' + collection.id });
            }}
          />
        ))}
      </HorizontalScroller>
    </>
  );
});
