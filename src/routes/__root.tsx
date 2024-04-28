import Roadmap from '../ui/components/Roadmap';
import DevPuzzles, { DEV_PUZZLES } from '../ui/DevPuzzles';
import ModeSwitcher from '../ui/modes/ModeSwitcher';
import EditContext from '../ui/EditContext';
import GridContext from '../ui/GridContext';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import TanStackDevTools from '../ui/router/TanStackDevTools';
import { Suspense, lazy, memo } from 'react';
import { FaGithub } from 'react-icons/fa';
import AnimationToggle from '../ui/components/AnimationToggle';
import GridStateContext from '../ui/GridStateContext';
import DocumentTitle from '../ui/components/DocumentTitle';
import DisplayContext from '../ui/DisplayContext';
const ThemeSwitcher = lazy(() => import('../ui/components/ThemeSwitcher'));

export const Route = createRootRoute({
  component: memo(function Root() {
    return (
      <DisplayContext>
        <EditContext>
          <GridStateContext>
            <GridContext>
              <DocumentTitle>Logic Pad</DocumentTitle>
              <div className="h-dvh w-dvw overflow-auto bg-neutral">
                <div className="flex flex-col items-stretch w-full min-h-full xl:h-full">
                  <header className="flex flex-wrap justify-between items-stretch gap-4 px-8 py-2">
                    <div className="flex flex-wrap grow shrink items-center gap-4">
                      <h1 className="text-3xl text-neutral-content">
                        Logic Pad
                      </h1>
                      <ul className="menu menu-horizontal bg-base-200 rounded-box">
                        <li className="dropdown dropdown-bottom">
                          <div tabIndex={0} role="button">
                            Dev Puzzles{' '}
                            <span className="badge badge-accent">
                              {DEV_PUZZLES.length}
                            </span>
                          </div>
                          <DevPuzzles />
                        </li>
                        <li className="dropdown dropdown-bottom">
                          <div tabIndex={0} role="button">
                            Roadmap
                          </div>
                          <Roadmap />
                        </li>
                      </ul>
                    </div>
                    <ModeSwitcher />
                    <div className="flex xl:basis-[320px] grow shrink justify-end items-center">
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
                  </header>
                  <Outlet />
                  <TanStackDevTools />
                </div>
              </div>
            </GridContext>
          </GridStateContext>
        </EditContext>
      </DisplayContext>
    );
  }),
});
