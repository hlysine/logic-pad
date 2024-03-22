import { memo } from 'react';
import ModeButton from './ModeButton';
import { useRouterState } from '@tanstack/react-router';
import { Mode } from '../../data/primitives';

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
