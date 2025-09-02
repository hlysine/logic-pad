import { useSuspenseQuery } from '@tanstack/react-query';
import { memo } from 'react';
import { api } from './api';
import HorizontalScroller from '../components/HorizontalScroller';
import { useNavigate } from '@tanstack/react-router';
import CollectionCard from './CollectionCard';

export default memo(function PersonalFrontPageLists() {
  const navigate = useNavigate();
  const { data } = useSuspenseQuery({
    queryKey: ['frontpage', 'me'],
    queryFn: api.getPersonalFrontPage,
  });
  return (
    <>
      <HorizontalScroller
        title="Followed collections"
        scrollable={false}
        className="flex-wrap box-content max-h-[calc(96px*2+1rem)] w-full"
        onExpand={async () => {
          await navigate({
            to: '/search/collections',
          });
        }}
      >
        {data.followedCollections.map(collection => (
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
