import { memo, useEffect, useId } from 'react';
import { useOnlinePuzzle } from '../contexts/OnlinePuzzleContext';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { api, bidirectionalInfiniteQuery } from './api';
import { RiPlayList2Fill } from 'react-icons/ri';
import { collectionQueryOptions } from '../routes/_layout.collection.$collectionId';
import Loading from '../components/Loading';
import PuzzleCard from './PuzzleCard';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate, useRouterState } from '@tanstack/react-router';

export interface CollectionSidebarProps {
  collectionId: string | null;
}

export default memo(function CollectionSidebar({
  collectionId,
}: CollectionSidebarProps) {
  const drawerId = useId();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { id, puzzle } = useOnlinePuzzle();
  const collection = useQuery({
    ...collectionQueryOptions(collectionId!),
    enabled: !!collectionId,
  });
  const puzzleList = useInfiniteQuery({
    ...bidirectionalInfiniteQuery(
      ['collection', collectionId, 'puzzles'],
      (cursorBefore, cursorAfter) =>
        api.listCollectionPuzzles(collectionId!, cursorBefore, cursorAfter)
    ),
    initialData: {
      pages: [
        {
          total: 1,
          results: [puzzle!],
        },
      ],
      pageParams: [undefined],
    },
    enabled: !!collectionId && !!id,
  });
  useEffect(() => {
    if (!puzzleList.isPending) {
      if (puzzleList.data?.pages.length === 1) {
        void (async () => {
          if (puzzleList.hasNextPage) await puzzleList.fetchNextPage();
          if (puzzleList.hasPreviousPage) await puzzleList.fetchPreviousPage();
        })();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzleList.isPending]);

  if (!id || !puzzle || !collectionId) return null;

  if (collection.isPending) return <Loading className="h-8" />;

  return (
    <div className="drawer">
      <input
        id={`three-pane-${drawerId}`}
        type="checkbox"
        className="drawer-toggle"
      />
      <label
        htmlFor={`three-pane-${drawerId}`}
        className="drawer-content btn btn-ghost drawer-button -ml-4 h-fit gap-4 text-neutral-content rounded-none rounded-r-lg justify-start"
      >
        <RiPlayList2Fill size={24} />
        <div className="flex flex-col items-start gap-1 h-fit">
          <span className="text-lg shrink-0">{collection.data!.title}</span>
          {collection.data?.puzzleCount !== null && (
            <span className="opacity-80 shrink-0">
              {collection.data?.puzzleCount} puzzles
            </span>
          )}
        </div>
      </label>
      <div className="drawer-side !overflow-x-visible !overflow-y-visible z-50 h-full w-full">
        <label
          htmlFor={`three-pane-${drawerId}`}
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="h-full w-full pointer-events-none">
          <div className="h-full w-[350px] max-w-full shrink-0 grow-0 flex flex-col items-center p-4 gap-4 bg-neutral text-neutral-content self-stretch pointer-events-auto">
            {puzzleList.isFetchingPreviousPage ? (
              <Loading className="h-4 p-4" />
            ) : puzzleList.hasPreviousPage ? (
              <button
                className="btn btn-sm w-fit"
                onClick={async () => await puzzleList.fetchPreviousPage()}
              >
                Load more
                <FaChevronUp />
              </button>
            ) : null}
            {puzzleList.data?.pages.flatMap(page =>
              page.results.map(puzzle => (
                <PuzzleCard
                  key={puzzle.id}
                  puzzle={puzzle}
                  onClick={async () => {
                    const newPath = routerState.location.pathname
                      .split('/')
                      .slice(0, -1)
                      .join('/');
                    await navigate({
                      to: `${newPath}/${puzzle.id}`,
                      search: {
                        collection: routerState.location.search.collection,
                      },
                      reloadDocument: true,
                    });
                  }}
                />
              ))
            )}
            {puzzleList.isFetchingNextPage ? (
              <Loading className="h-4 p-4" />
            ) : puzzleList.hasNextPage ? (
              <button
                className="btn btn-sm w-fit"
                onClick={async () => await puzzleList.fetchNextPage()}
              >
                Load more
                <FaChevronDown />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
});
