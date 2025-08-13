import { memo, useMemo } from 'react';
import { PuzzleBrief } from './data';
import { FaCheckSquare, FaHeart, FaMusic } from 'react-icons/fa';
import { PiCheckerboardFill } from 'react-icons/pi';
import { TbLayoutGridRemove, TbLayoutGrid } from 'react-icons/tb';
import { PuzzleType } from '@logic-pad/core/index';
import { BsQuestionSquare } from 'react-icons/bs';
import Difficulty from '../metadata/Difficulty';
import { useNavigate } from '@tanstack/react-router';
import { cn } from '../uiHelper';

export interface PuzzleCardProps {
  puzzle: PuzzleBrief;
}

function getIconForType(type: PuzzleType) {
  switch (type) {
    case PuzzleType.Music:
      return FaMusic;
    case PuzzleType.Pattern:
      return PiCheckerboardFill;
    case PuzzleType.Underclued:
      return TbLayoutGridRemove;
    case PuzzleType.Logic:
      return TbLayoutGrid;
  }
}

const PuzzleIcon = memo(function PuzzleIcon({
  types,
  className,
  size,
}: {
  types: PuzzleType[];
  className?: string;
  size: number;
}) {
  const styles = useMemo(
    () => ({
      width: size,
      height: size,
    }),
    [size]
  );
  if (types.length === 0) {
    return <BsQuestionSquare size={size} className={className} />;
  } else if (types.length === 1) {
    const Icon = getIconForType(types[0]);
    return <Icon size={size} className={className} />;
  } else if (types.length === 2) {
    const Icon1 = getIconForType(types[0]);
    const Icon2 = getIconForType(types[1]);
    return (
      <div
        style={styles}
        className={cn(
          'relative bg-base-300 [.wrapper:hover_&]:bg-base-100 transition-colors',
          className
        )}
      >
        <Icon1
          size={(size / 3) * 2}
          className="absolute top-0 left-0 bg-inherit"
        />
        <Icon2
          size={(size / 3) * 2}
          className="absolute bottom-0 right-0 bg-inherit"
        />
      </div>
    );
  } else if (types.length === 3) {
    const Icon1 = getIconForType(types[0]);
    const Icon2 = getIconForType(types[1]);
    const Icon3 = getIconForType(types[2]);
    return (
      <div
        style={styles}
        className={cn(
          'relative bg-base-300 [.wrapper:hover_&]:bg-base-100 transition-colors',
          className
        )}
      >
        <Icon1 size={size / 2} className="absolute top-0 left-0 bg-inherit" />
        <Icon2
          size={size / 2}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-inherit"
        />
        <Icon3 size={size / 2} className="absolute top-0 right-0 bg-inherit" />
      </div>
    );
  } else if (types.length >= 4) {
    const Icon1 = getIconForType(types[0]);
    const Icon2 = getIconForType(types[1]);
    const Icon3 = getIconForType(types[2]);
    const Icon4 = getIconForType(types[3]);
    return (
      <div
        style={styles}
        className={cn(
          'relative bg-base-300 [.wrapper:hover_&]:bg-base-100 transition-colors',
          className
        )}
      >
        <Icon1 size={size / 2} className="absolute top-0 left-0 bg-inherit" />
        <Icon2 size={size / 2} className="absolute top-0 right-0 bg-inherit" />
        <Icon3
          size={size / 2}
          className="absolute bottom-0 left-0 bg-inherit"
        />
        <Icon4
          size={size / 2}
          className="absolute bottom-0 right-0 bg-inherit"
        />
      </div>
    );
  }
});

export default memo(function PuzzleCard({ puzzle }: PuzzleCardProps) {
  const navigate = useNavigate();

  return (
    <div className="w-[320px] h-[116px] hover:z-50">
      <div
        className="w-full h-full hover:h-fit flex gap-4 items-center px-4 py-2 bg-base-300 rounded-xl shadow-md wrapper hover:shadow-xl hover:bg-base-100 transition-all"
        role="button"
        onClick={async () => {
          await navigate({
            to: `/solve/${puzzle.id}`,
          });
        }}
      >
        <PuzzleIcon types={puzzle.types} size={36} className="shrink-0" />
        <div className="flex flex-col">
          <h2 className="text-lg font-bold whitespace-nowrap [.wrapper:hover_&]:whitespace-normal overflow-hidden text-ellipsis">
            {puzzle.title}
          </h2>
          <div className="badge badge-neutral bg-neutral/40 badge-md mt-1">
            {puzzle.creator.name}
          </div>
          <div className="flex gap-2 mt-2 text-sm">
            <span>
              {puzzle.width}&times;{puzzle.height}
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
