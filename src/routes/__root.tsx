import Roadmap from '../ui/Roadmap';
import DevPuzzles, { DEV_PUZZLES } from '../ui/DevPuzzles';
import ThemeSwitcher from '../ui/ThemeSwitcher';
import ModeSwitcher from '../ui/modes/ModeSwitcher';
import EditContext from '../ui/EditContext';
import GridContext from '../ui/GridContext';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import TanStackDevTools from '../ui/router/TanStackDevTools';
import { memo } from 'react';
import { FaGithub } from 'react-icons/fa';

export const Route = createRootRoute({
  component: memo(function Root() {
    return (
      <EditContext>
        <GridContext>
          <div className="h-dvh w-dvw overflow-auto bg-neutral">
            <div className="flex flex-col items-stretch min-h-full w-full">
              <header className="flex flex-wrap justify-between items-stretch gap-4 px-8 py-2">
                <div className="flex flex-wrap grow shrink items-center gap-4">
                  <h1 className="text-3xl text-neutral-content">Logic Pad</h1>
                  <ul className="menu menu-horizontal bg-base-200 rounded-box">
                    <li className="dropdown dropdown-bottom">
                      <div tabIndex={0} role="button">
                        Levels
                      </div>
                      <DevPuzzles />
                    </li>
                  </ul>
                </div>
              </header>
              <Outlet />
            </div>
          </div>
        </GridContext>
      </EditContext>
    );
  }),
});
