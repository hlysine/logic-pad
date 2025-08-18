import { memo, useEffect, useId } from 'react';
import { useOnlinePuzzle } from '../contexts/OnlinePuzzleContext';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { api, bidirectionalInfiniteQuery } from './api';
import { RiPlayList2Fill } from 'react-icons/ri';
import { collectionQueryOptions } from '../routes/_layout.collection.$collectionId';
import Loading from '../components/Loading';
import { PuzzleIcon } from './PuzzleCard';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import UserCard from '../metadata/UserCard';
import Difficulty from '../metadata/Difficulty';

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
    if (!puzzleList.isFetching && puzzleList.error === null) {
      if (puzzleList.data?.pages.length === 1) {
        void (async () => {
          if (puzzleList.hasNextPage) await puzzleList.fetchNextPage();
          else if (puzzleList.hasPreviousPage)
            await puzzleList.fetchPreviousPage();
        })();
      } else if (
        puzzleList.data?.pages.length === 2 &&
        puzzleList.data.pageParams[0] === undefined
      ) {
        if (puzzleList.hasPreviousPage) void puzzleList.fetchPreviousPage();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzleList.isFetching]);

  if (!id || !puzzle || !collectionId || !collection.data) return null;

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
          <span className="text-lg shrink-0">{collection.data.title}</span>
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
          <div className="h-full w-[350px] max-w-full shrink-0 grow-0 flex flex-col items-center p-4 bg-neutral text-neutral-content self-stretch pointer-events-auto">
            <div className="flex flex-col gap-2 items-start w-full">
              <div className="text-accent text-sm uppercase">Collection</div>
              <div className="text-2xl">{collection.data.title}</div>
              <UserCard user={collection.data.creator} />
              <div>{collection.data.description}</div>
            </div>
            <div className="divider" />
            <div className="flex flex-col items-center w-full overflow-y-auto flex-1 [&>*]:shrink-0">
              {puzzleList.isFetchingPreviousPage ? (
                <Loading className="h-4 p-4" />
              ) : puzzleList.hasPreviousPage ? (
                <button
                  className="btn btn-sm btn-neutral w-fit"
                  onClick={async () => await puzzleList.fetchPreviousPage()}
                >
                  Load more
                  <FaChevronUp />
                </button>
              ) : null}
              {puzzleList.data?.pages.flatMap(page =>
                page.results.map(puzzle => (
                  <>
                    <button
                      key={puzzle.id}
                      className="btn btn-ghost w-full h-fit flex flex-row flex-nowrap gap-2 items-center justify-start text-start"
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
                        });
                      }}
                    >
                      <PuzzleIcon
                        types={puzzle.types}
                        size={36}
                        className="shrink-0"
                      />
                      <div className="flex flex-col items-start gap-2">
                        <h2 className="text-lg font-normal">
                          {puzzle.title.length === 0
                            ? 'Untitled Puzzle'
                            : puzzle.title}
                        </h2>
                        <div className="badge badge-md">
                          {puzzle.creator.name}
                        </div>
                        <Difficulty value={puzzle.designDifficulty} size="sm" />
                      </div>
                    </button>
                    <div className="divider m-0" />
                  </>
                ))
              )}
              {puzzleList.isFetchingNextPage ? (
                <Loading className="h-4 p-4" />
              ) : puzzleList.hasNextPage ? (
                <button
                  className="btn btn-sm btn-neutral w-fit"
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
    </div>
  );
});
