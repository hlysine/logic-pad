import ModeSwitcher from '../components/ModeSwitcher';
import { Link, Outlet, createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import QuickAccessBar from '../components/QuickAccessBar';

export const Route = createLazyFileRoute('/_context/_layout')({
  component: memo(function Layout() {
    return (
      <>
        <header className="flex shrink-0 flex-wrap justify-between items-center gap-4 px-8 py-2">
          <div className="flex xl:basis-[320px] flex-wrap grow shrink items-center gap-4">
            <Link
              to="/"
              className="text-xl md:text-3xl text-neutral-content flex items-center gap-2"
            >
              <img
                src="/logo.svg"
                className="w-8 h-8 inline-block"
                alt="Logic Pad logo"
              />
              Logic Pad
            </Link>
          </div>
          <ModeSwitcher />
          <QuickAccessBar className="xl:basis-[320px] grow shrink justify-end" />
        </header>
        <Outlet />
      </>
    );
  }),
});
