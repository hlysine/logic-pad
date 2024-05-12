import { Outlet, createRootRoute } from '@tanstack/react-router';
import ThemeContext from '../ui/ThemeContext';
import DocumentTitle from '../ui/components/DocumentTitle';
import PWAPrompt from '../ui/components/PWAPrompt';
import TanStackDevTools from '../ui/router/TanStackDevTools';
import { memo } from 'react';
import GridContext from '../ui/GridContext';
import GridStateContext from '../ui/GridStateContext';
import EditContext from '../ui/EditContext';
import DisplayContext from '../ui/DisplayContext';
import SolverContext from '../ui/SolverContext';

export const Route = createRootRoute({
  component: memo(function Root() {
    return (
      <ThemeContext>
        <DisplayContext>
          <EditContext>
            <GridStateContext>
              <GridContext>
                <SolverContext>
                  <div className="h-dvh w-dvw overflow-y-auto overflow-x-hidden bg-neutral">
                    <div id="color-ref-error" className="text-error hidden">
                      {/* For canvas components to retrieve this color */}
                    </div>
                    <div id="color-ref-accent" className="text-accent hidden">
                      {/* For canvas components to retrieve this color */}
                    </div>
                    <div id="color-ref-info" className="text-info hidden">
                      {/* For canvas components to retrieve this color */}
                    </div>
                    <div id="color-ref-black" className="text-black hidden">
                      {/* For canvas components to retrieve this color */}
                    </div>
                    <div id="color-ref-white" className="text-white hidden">
                      {/* For canvas components to retrieve this color */}
                    </div>
                    <div
                      id="color-ref-neutral-content"
                      className="text-neutral-content/20 hidden"
                    >
                      {/* For canvas components to retrieve this color */}
                    </div>
                    <DocumentTitle>Logic Pad</DocumentTitle>
                    <PWAPrompt />
                    <div className="flex flex-col items-stretch w-full min-h-full xl:h-full">
                      <Outlet />
                      <TanStackDevTools />
                    </div>
                  </div>
                </SolverContext>
              </GridContext>
            </GridStateContext>
          </EditContext>
        </DisplayContext>
      </ThemeContext>
    );
  }),
});
