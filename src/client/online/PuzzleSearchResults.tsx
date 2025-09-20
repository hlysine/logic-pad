import { memo, ReactNode } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FaChevronDown } from 'react-icons/fa';
import Loading from '../components/Loading';
import PuzzleCard from './PuzzleCard';
import { PublicPuzzleSearchParams } from './PuzzleSearchQuery';
import { PuzzleBrief } from './data';
import { bidirectionalInfiniteQuery, api } from './api';
import { ToOptions } from '@tanstack/react-router';

export const searchPuzzlesInfiniteQueryOptions = (
  search: PublicPuzzleSearchParams
) =>
  bidirectionalInfiniteQuery(
    ['puzzle', 'search', search],
    (cursorBefore, cursorAfter) =>
      api.searchPuzzles(search, cursorBefore, cursorAfter)
  );

export interface PuzzleSearchResultsProps {
  params: PublicPuzzleSearchParams;
  to?: (puzzle: PuzzleBrief) => ToOptions;
  onClick?: (puzzle: PuzzleBrief) => void;
  puzzleCardChildren?: (puzzle: PuzzleBrief) => ReactNode;
}

export default memo(function PuzzleSearchResults({
  params,
  to,
  onClick,
  puzzleCardChildren,
}: PuzzleSearchResultsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    searchPuzzlesInfiniteQueryOptions(params)
  );

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex flex-wrap gap-4 justify-center">
        {data?.pages.flatMap(page =>
          page.results.map(puzzle => (
            <PuzzleCard
              key={puzzle.id}
              puzzle={puzzle}
              onClick={() => onClick?.(puzzle)}
              {...to?.(puzzle)}
            >
              {puzzleCardChildren?.(puzzle)}
            </PuzzleCard>
          ))
        )}
      </div>
      {isFetching ? (
        <Loading />
      ) : hasNextPage ? (
        <button className="btn" onClick={async () => await fetchNextPage()}>
          Load more
          <FaChevronDown />
        </button>
      ) : null}
    </div>
  );
});
