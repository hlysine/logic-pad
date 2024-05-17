import { Suspense, lazy, memo } from 'react';
import { FaGithub } from 'react-icons/fa';
import AnimationToggle from './AnimationToggle';
import { cn } from '../../utils';
const ThemeSwitcher = lazy(() => import('./ThemeSwitcher'));

export interface QuickAccessBarProps {
  className?: string;
}

export default memo(function QuickAccessBar({
  className,
}: QuickAccessBarProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <AnimationToggle />
      <Suspense>
        <ThemeSwitcher />
      </Suspense>
      <a
        className="btn btn-square"
        href="https://github.com/hlysine/logic-pad"
        target="_blank"
        rel="noreferrer"
      >
        <FaGithub size={24} />
      </a>
    </div>
  );
});
