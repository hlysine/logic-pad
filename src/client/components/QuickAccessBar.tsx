import { Suspense, lazy, memo } from 'react';
import { FaGithub } from 'react-icons/fa';
import { cn } from '../../client/uiHelper.ts';
import Loading from './Loading';
import Settings from './Settings.tsx';
const ThemeSwitcher = lazy(() => import('./ThemeSwitcher'));

export interface QuickAccessBarProps {
  className?: string;
}

export default memo(function QuickAccessBar({
  className,
}: QuickAccessBarProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Settings />
      <Suspense fallback={<Loading className="w-24" />}>
        <ThemeSwitcher />
      </Suspense>
      <a
        className="btn btn-square"
        aria-label="GitHub repository"
        href="https://github.com/hlysine/logic-pad"
        target="_blank"
        rel="noreferrer"
      >
        <FaGithub size={24} />
      </a>
    </div>
  );
});
