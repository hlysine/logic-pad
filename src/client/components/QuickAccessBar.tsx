import { Suspense, lazy, memo } from 'react';
import { cn } from '../../client/uiHelper.ts';
import Loading from './Loading';
import Settings from './Settings.tsx';
import AccountControl from './AccountControl.tsx';
import Notifications from './Notifications.tsx';
import { Link } from '@tanstack/react-router';
import { FaHeart } from 'react-icons/fa';
const ThemeSwitcher = lazy(() => import('./ThemeSwitcher'));

export interface QuickAccessBarProps {
  className?: string;
}

export default memo(function QuickAccessBar({
  className,
}: QuickAccessBarProps) {
  return (
    <div className={cn('flex items-center gap-1 [&>*]:shrink-0', className)}>
      <Suspense fallback={<Loading className="w-24" />}>
        <ThemeSwitcher />
      </Suspense>
      <Settings />
      <Link
        to="/support"
        className="btn btn-square btn-ghost max-md:btn-sm text-neutral-content"
      >
        <FaHeart size={22} />
      </Link>
      <Notifications />
      <AccountControl />
    </div>
  );
});
