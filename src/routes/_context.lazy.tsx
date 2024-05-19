import { Outlet, createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import DisplayContext from '../ui/DisplayContext';
import EditContext from '../ui/EditContext';
import GridContext from '../ui/GridContext';
import GridStateContext from '../ui/GridStateContext';
import SolverContext from '../ui/SolverContext';

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
