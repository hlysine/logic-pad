import { Link, Outlet, createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import QuickAccessBar from '../components/QuickAccessBar';

export const Route = createLazyFileRoute('/_context/_layout')({
  component: memo(function Layout() {
    return (
      <>
        <header className="flex shrink-0 flex-wrap justify-between items-center gap-4 px-8 py-2">
          <div className="flex xl:basis-[320px] flex-wrap grow shrink items-center gap-12">
            <Link
              to="/"
              className="text-xl md:text-3xl text-neutral-content flex items-center gap-2 force-serif"
            >
              <img
                src="/logo.svg"
                className="w-8 h-8 inline-block"
                alt="Logic Pad logo"
              />
              Logic Pad
            </Link>
            <Link
              to="/solve"
              className="md:text-lg text-neutral-content flex items-center gap-2"
            >
              Explore
            </Link>
            <Link
              to="/create"
              className="md:text-lg text-neutral-content flex items-center gap-2"
            >
              Create
            </Link>
          </div>
          <QuickAccessBar className="xl:basis-[320px] grow shrink justify-end" />
        </header>
        <Outlet />
      </>
    );
  }),
});
