import { memo } from 'react';
import RatedDifficulty from './RatedDifficulty';
import { useOnlinePuzzle } from '../contexts/OnlinePuzzleContext';
import { useOnline } from '../contexts/OnlineContext';
import { useQuery } from '@tanstack/react-query';
import { puzzleSolveQueryOptions } from '../routes/_context._layout.solve.$puzzleId';
import Loading from '../components/Loading';

export default memo(function OnlineMetadata() {
  const { isOnline } = useOnline();
  const { id } = useOnlinePuzzle();
  const puzzle = useQuery(puzzleSolveQueryOptions(id));
  if (!isOnline || !id) return null;
  if (puzzle.isPending) {
    return <Loading />;
  }
  return (
    <>
      <div className="flex gap-2">
        <span className="badge badge-ghost badge-lg p-4 bg-base-100 text-base-content border-0">
          {puzzle.data!.solveCount} solves
        </span>
        <span className="badge badge-ghost badge-lg p-4 bg-base-100 text-base-content border-0">
          {puzzle.data!.loveCount} loves
        </span>
      </div>
      <RatedDifficulty
        key="ratedDifficulty"
        ratedDifficulty={puzzle.data!.ratedDifficulty}
        collapsible={true}
      />
    </>
  );
});
