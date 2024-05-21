import { Outlet, createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import DisplayContext from '../contexts/DisplayContext.tsx';
import EditContext from '../contexts/EditContext.tsx';
import GridContext from '../contexts/GridContext.tsx';
import GridStateContext from '../contexts/GridStateContext.tsx';
import SolverContext from '../contexts/SolverContext.tsx';

export const Route = createLazyFileRoute('/_context')({
  component: memo(function Context() {
    return (
      <DisplayContext>
        <EditContext>
          <GridStateContext>
            <GridContext>
              <SolverContext>
                <Outlet />
              </SolverContext>
            </GridContext>
          </GridStateContext>
        </EditContext>
      </DisplayContext>
    );
  }),
});
