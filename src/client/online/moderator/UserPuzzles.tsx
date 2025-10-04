import { useInfiniteQuery } from '@tanstack/react-query';
import { memo, useMemo } from 'react';
import { searchPuzzlesInfiniteQueryOptions } from '../PuzzleSearchResults';
import { PublicPuzzleSearchParams } from '../PuzzleSearchQuery';
import Loading from '../../components/Loading';
import InfiniteScrollTrigger from '../../components/InfiniteScrollTrigger';
import { PuzzleBrief, ResourceStatus } from '../data';
import { FaCheckSquare, FaEyeSlash, FaHeart, FaListOl } from 'react-icons/fa';
import Difficulty from '../../metadata/Difficulty';
import { count, toRelativeDate } from '../../uiHelper';
import Skeleton from '../../components/Skeleton';
import { medianFromHistogram } from '../../metadata/RatedDifficulty';

const UserPuzzle = memo(function UserPuzzle({
  puzzle,
}: {
  puzzle: PuzzleBrief;
}) {
  return (
    <div className="flex flex-col items-start self-stretch gap-1 shrink-0">
      <h3 className="text-lg">
        {puzzle.inSeries && (
          <FaListOl size={14} className="inline text-accent" />
        )}{' '}
        {puzzle.title.length === 0 ? (
          <span className="opacity-80">Untitled Puzzle</span>
        ) : (
          puzzle.title
        )}
      </h3>
      <div className="text-xs opacity-80 flex flex-wrap gap-2">
        <span>Created {toRelativeDate(new Date(puzzle.createdAt))}</span>
        <span>Updated {toRelativeDate(new Date(puzzle.updatedAt))}</span>
        {puzzle.publishedAt && (
          <span>Published {toRelativeDate(new Date(puzzle.publishedAt))}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        <span>
          {puzzle.width}&times;{puzzle.height}
        </span>
        <Difficulty value={puzzle.designDifficulty} size="sm" />
        <span>Rated:</span>
        <Difficulty
          value={medianFromHistogram(puzzle.ratedDifficulty)}
          size="sm"
        />
      </div>
      {puzzle.status === ResourceStatus.Public ? (
        <div className="flex gap-4 text-sm opacity-80">
          <span className="flex items-center">
            <FaCheckSquare className="me-2" /> {puzzle.solveCount}
          </span>
          <span className="flex items-center">
            <FaHeart className="me-2" /> {puzzle.loveCount}
          </span>
        </div>
      ) : (
        <div className="flex gap-4 text-sm opacity-80">
          <span className="flex items-center">
            <FaEyeSlash className="me-2" />
            Private
          </span>
        </div>
      )}
      <div className="text-xs break-words">{puzzle.description}</div>
      <div className="divider my-0" />
    </div>
  );
});

export interface UserPuzzlesProps {
  userId: string;
}

export default memo(function UserPuzzles({ userId }: UserPuzzlesProps) {
  const searchParams = useMemo<PublicPuzzleSearchParams>(
    () => ({
      q: `creator=${userId}`,
      sort: 'published-desc',
    }),
    [userId]
  );
  const { data, isPending, isFetching, hasNextPage, fetchNextPage } =
    useInfiniteQuery(searchPuzzlesInfiniteQueryOptions(searchParams));
  return (
    <div className="flex flex-col gap-4 w-[400px] max-w-full shrink-0">
      <h2 className="font-semibold text-xl shrink-0">
        Puzzles{' '}
        {data?.pages[0] && (
          <span className="badge badge-neutral">
            {count(data?.pages[0]?.total)}
          </span>
        )}
      </h2>
      <div className="flex-1 overflow-y-auto infinte-scroll">
        {isPending ? (
          <div className="flex flex-col gap-4 items-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="flex flex-col gap-2 w-full items-stretch" key={i}>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-20" />
                <div className="divider my-0" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center">
            {data?.pages.flatMap(page =>
              page.results.map(puzzle => (
                <UserPuzzle key={puzzle.id} puzzle={puzzle} />
              ))
            )}
            {isFetching ? (
              <Loading className="h-fit" />
            ) : hasNextPage ? (
              <InfiniteScrollTrigger
                onLoadMore={async () => await fetchNextPage()}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
});
