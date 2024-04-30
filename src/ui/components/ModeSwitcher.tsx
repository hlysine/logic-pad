import { memo } from 'react';
import { useRouterState, useSearch, useNavigate } from '@tanstack/react-router';
import { Color, Mode } from '../../data/primitives';
import { cn } from '../../utils';
import { Serializer } from '../../data/serializer/allSerializers';
import { Compressor } from '../../data/serializer/compressor/allCompressors';
import { useGrid } from '../GridContext';
import { Puzzle } from '../../data/puzzle';

export interface ModeButtonProps {
  active: boolean;
  link: string;
  children?: React.ReactNode;
}

const ModeButton = memo(function ModeButton({
  active,
  link,
  children,
}: ModeButtonProps) {
  const state = useRouterState();
  const { metadata, grid, solution } = useGrid();
  const navigate = useNavigate();
  const search = useSearch({ from: undefined, strict: false });
  return (
    <button
      type="button"
      role="tab"
      onClick={async () => {
        let puzzle: Puzzle | undefined;
        if (state.location.pathname === '/create') {
          const overwrite = !!grid.find(
            t => !t.fixed && t.color !== Color.Gray
          );
          if (overwrite) {
            puzzle = { ...metadata, grid: grid.resetTiles(), solution: grid };
          }
        }
        if (!puzzle) {
          puzzle = { ...metadata, grid, solution };
        }
        await navigate({
          to: link,
          search: {
            ...search,
            d: await Compressor.compress(Serializer.stringifyPuzzle(puzzle)),
          },
        });
      }}
      className={cn('tab w-36 capitalize', active && 'tab-active')}
    >
      {state.isTransitioning ? (
        <span className="loading loading-bars loading-md"></span>
      ) : (
        children
      )}
    </button>
  );
});

const allModes = new Map([
  [Mode.Create, '/create'],
  [Mode.Solve, '/solve'],
]);

export default memo(function ModeSwitcher() {
  const state = useRouterState();
  return (
    <div
      role="tablist"
      className="tabs tabs-boxed tabs-lg bg-base-100 shadow-lg"
    >
      {[...allModes.entries()].map(([m, path]) => (
        <ModeButton
          key={m}
          active={state.location.pathname === path}
          link={path}
        >
          {m}
        </ModeButton>
      ))}
    </div>
  );
});
