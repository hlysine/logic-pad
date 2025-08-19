import { memo, ReactNode } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api, bidirectionalInfiniteQuery } from './api';
import { FaChevronDown } from 'react-icons/fa';
import Loading from '../components/Loading';
import PuzzleCard from './PuzzleCard';
import { PuzzleSearchParams } from './PuzzleSearchQuery';
import { PuzzleBrief } from './data';

export interface PuzzleSearchResultsProps {
  params: PuzzleSearchParams;
  onClick: (puzzle: PuzzleBrief) => void;
  puzzleCardChildren?: (puzzle: PuzzleBrief) => ReactNode;
}

export default memo(function PuzzleSearchResults({
  params,
  onClick,
  puzzleCardChildren,
}: PuzzleSearchResultsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    bidirectionalInfiniteQuery(
      ['puzzle', 'search', params],
      (cursorBefore, cursorAfter) =>
        api.searchPuzzles(params, cursorBefore, cursorAfter)
    )
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
