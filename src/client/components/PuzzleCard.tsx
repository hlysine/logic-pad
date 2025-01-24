import { memo, useMemo } from 'react';
import GridData from '@logic-pad/core/data/grid';
import { PuzzleMetadata } from '@logic-pad/core/data/puzzle';
import Difficulty from '../metadata/Difficulty.tsx';
import { TbLayoutGrid, TbLayoutGridRemove } from 'react-icons/tb';
import { FaMusic } from 'react-icons/fa6';
import { PiCheckerboardFill } from 'react-icons/pi';
import { Link } from '@tanstack/react-router';
import { cn } from '../../client/uiHelper.ts';
import { HiOutlineViewGridAdd } from 'react-icons/hi';

export interface PuzzleCardProps {
  grid: GridData;
  metadata: PuzzleMetadata;
  data: string;
  className?: string;
}

export function getPuzzleType(grid: GridData) {
  if (grid.musicGrid.value) {
    return 'Music';
  } else if (grid.completePattern.value) {
    return 'Pattern';
  } else if (grid.underclued.value) {
    return 'Underclued';
  } else {
    return 'Logic';
  }
}

export const puzzleTypeFilters = [
  { name: 'All', icon: HiOutlineViewGridAdd },
  { name: 'Logic', icon: TbLayoutGrid },
  { name: 'Underclued', icon: TbLayoutGridRemove },
  { name: 'Pattern', icon: PiCheckerboardFill },
  { name: 'Music', icon: FaMusic },
];

export default memo(function PuzzleCard({
  grid,
  metadata,
  data,
  className,
}: PuzzleCardProps) {
  const Icon = useMemo(() => {
    const type = getPuzzleType(grid);
    if (type === 'Music') {
      return FaMusic;
    } else if (type === 'Pattern') {
      return PiCheckerboardFill;
    } else if (type === 'Underclued') {
      return TbLayoutGridRemove;
    } else {
      return TbLayoutGrid;
    }
  }, [grid]);

  return (
    <Link
      className={cn(
        'btn shadow-md bg-base-100/15 hover:bg-base-300/15 text-neutral-content inline-flex h-fit min-h-0 max-w-full',
        className
      )}
      to="/solve"
      search={{ d: data }}
    >
      <Icon size={48} className="m-4" />
      <div className="flex flex-col gap-2 p-4">
        <h2 className="card-title text-wrap">{metadata.title}</h2>
        <div className="text-left">{metadata.author}</div>
        <Difficulty value={metadata.difficulty} size="sm" />
      </div>
    </Link>
  );
});
