import { memo, useMemo } from 'react';
import { PuzzleBrief } from './data';
import { FaCheckSquare, FaHeart, FaMusic } from 'react-icons/fa';
import { PiCheckerboardFill } from 'react-icons/pi';
import { TbLayoutGridRemove, TbLayoutGrid } from 'react-icons/tb';
import { PuzzleType } from '@logic-pad/core/index';
import { BsQuestionSquare } from 'react-icons/bs';
import Difficulty from '../metadata/Difficulty';
import { useNavigate } from '@tanstack/react-router';

export interface PuzzleCardProps {
  puzzle: PuzzleBrief;
}

export default memo(function PuzzleCard({ puzzle }: PuzzleCardProps) {
  const navigate = useNavigate();
  const Icon = useMemo(() => {
    const type = puzzle.types.length > 0 ? puzzle.types[0] : undefined;
    if (type === PuzzleType.Music) {
      return FaMusic;
    } else if (type === PuzzleType.Pattern) {
      return PiCheckerboardFill;
    } else if (type === PuzzleType.Underclued) {
      return TbLayoutGridRemove;
    } else if (type === PuzzleType.Logic) {
      return TbLayoutGrid;
    } else {
      return BsQuestionSquare;
    }
  }, [puzzle.types]);

  return (
    <div
      className="w-[320px] h-[120px] flex gap-4 items-center p-4 bg-base-100 rounded-lg shadow-md"
      role="button"
      onClick={async () => {
        await navigate({
          to: `/solve/${puzzle.id}`,
        });
      }}
    >
      <Icon size={36} />
      <div className="flex flex-col">
        <h2 className="text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis">
          {puzzle.title}
        </h2>
        <div className="badge badge-secondary badge-md mt-1">
          {puzzle.creator.name}
        </div>
        <div className="flex gap-2 mt-2 text-sm">
          <span>
            {puzzle.width}x{puzzle.height}
          </span>
          <Difficulty value={puzzle.designDifficulty} size="sm" />
        </div>
        <div className="flex gap-4 text-sm opacity-80">
          <span className="flex items-center">
            <FaCheckSquare className="me-2" /> {puzzle.solveCount}
          </span>
          <span className="flex items-center">
            <FaHeart className="me-2" /> {puzzle.loveCount}
          </span>
        </div>
      </div>
    </div>
  );
});
