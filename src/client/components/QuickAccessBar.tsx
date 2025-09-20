import { Suspense, lazy, memo } from 'react';
import { cn } from '../../client/uiHelper.ts';
import Loading from './Loading';
import Settings from './Settings.tsx';
import AccountControl from './AccountControl.tsx';
import Notifications from './Notifications.tsx';
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
      <Notifications />
      <AccountControl />
    </div>
  );
});
