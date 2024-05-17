import Roadmap from '../ui/components/Roadmap';
import ModeSwitcher from '../ui/components/ModeSwitcher';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import QuickAccessBar from '../ui/components/QuickAccessBar';

export const Route = createFileRoute('/_layout')({
  component: memo(function Layout() {
    return (
      <>
        <header className="flex flex-wrap justify-between items-center gap-4 px-8 py-2 shadow-md">
          <div className="flex flex-wrap grow shrink items-center gap-4">
            <h1 className="text-3xl text-neutral-content flex items-center gap-2">
              <img src="/logo.svg" className="w-8 h-8 inline-block" />
              Logic Pad
            </h1>
            <ul className="menu menu-horizontal bg-base-200 text-base-content rounded-box">
              <li className="dropdown dropdown-bottom">
                <button tabIndex={0} role="button">
                  Roadmap
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu menu-vertical min-w-[300px] max-h-[calc(100vh-100px)] flex-nowrap bg-base-200 rounded-box overflow-y-auto overflow-x-visible text-base-content z-50"
                >
                  <Roadmap />
                </ul>
              </li>
            </ul>
          </div>
          <ModeSwitcher />
          <QuickAccessBar className="xl:basis-[320px] grow shrink justify-end" />
        </header>
        <Outlet />
      </>
    );
  }),
});
