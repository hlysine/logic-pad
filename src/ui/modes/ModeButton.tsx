import { memo } from 'react';
import { cn } from '../../utils';
import { Link, useRouterState } from '@tanstack/react-router';

export interface ModeButtonProps {
  active: boolean;
  link: string;
  children?: React.ReactNode;
}

export default memo(function ModeButton({
  active,
  link,
  children,
}: ModeButtonProps) {
  const state = useRouterState();
  return (
    <Link
      to={link}
      role="tab"
      className={cn('tab w-36 capitalize', active && 'tab-active')}
    >
      {state.isTransitioning ? (
        <span className="loading loading-bars loading-md"></span>
      ) : (
        children
      )}
    </Link>
  );
});
