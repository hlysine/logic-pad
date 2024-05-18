import { memo, useMemo } from 'react';
import GridData from '../../data/grid';
import { PuzzleMetadata } from '../../data/puzzle';
import Difficulty from '../metadata/Difficulty';
import { TbLayoutGrid, TbLayoutGridRemove } from 'react-icons/tb';
import { instance as musicGridInstance } from '../../data/rules/musicGridRule';
import { instance as completePatternInstance } from '../../data/rules/completePatternRule';
import { instance as undercluedInstance } from '../../data/rules/undercluedRule';
import { FaMusic } from 'react-icons/fa6';
import { PiCheckerboardFill } from 'react-icons/pi';
import { Link } from '@tanstack/react-router';
import { cn } from '../../utils';
import { HiOutlineViewGridAdd } from 'react-icons/hi';

export interface PuzzleCardProps {
  grid: GridData;
  metadata: PuzzleMetadata;
  link: string;
  className?: string;
}

export function getPuzzleType(grid: GridData) {
  if (grid.rules.find(r => r.id === musicGridInstance.id)) {
    return 'Music';
  } else if (grid.rules.find(r => r.id === completePatternInstance.id)) {
    return 'Pattern';
  } else if (grid.rules.find(r => r.id === undercluedInstance.id)) {
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
  link,
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
      to={link}
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
