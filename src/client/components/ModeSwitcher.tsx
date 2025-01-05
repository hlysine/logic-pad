import { memo } from 'react';
import { useRouterState, useSearch, useNavigate } from '@tanstack/react-router';
import { Mode } from '@logic-pad/core/data/primitives.js';
import { cn } from '../../client/uiHelper.ts';
import { Serializer } from '@logic-pad/core/data/serializer/allSerializers.js';
import { Compressor } from '@logic-pad/core/data/serializer/compressor/allCompressors.js';
import { useGrid } from '../contexts/GridContext.tsx';

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
        await navigate({
          to: link,
          search: {
            ...search,
            d: await Compressor.compress(
              Serializer.stringifyPuzzle({ ...metadata, grid, solution })
            ),
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
