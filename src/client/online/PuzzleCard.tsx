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
    <div className="w-[320px] h-[116px] hover:z-50">
      <div
        className="w-full h-full hover:h-fit flex gap-4 items-center px-4 py-2 bg-base-300 rounded-lg shadow-md wrapper hover:shadow-xl hover:bg-base-100 transition-all"
        role="button"
        onClick={async () => {
          await navigate({
            to: `/solve/${puzzle.id}`,
          });
        }}
      >
        <Icon size={36} className="shrink-0" />
        <div className="flex flex-col">
          <h2 className="text-lg font-bold whitespace-nowrap [.wrapper:hover_&]:whitespace-normal overflow-hidden text-ellipsis">
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
              <span className="hidden [.wrapper:hover_&]:inline-block ms-1">
                solves
              </span>
            </span>
            <span className="flex items-center">
              <FaHeart className="me-2" /> {puzzle.loveCount}
              <span className="hidden [.wrapper:hover_&]:inline-block ms-1">
                loves
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
