import { Outlet, createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import DisplayContext from '../contexts/DisplayContext.tsx';
import EditContext from '../contexts/EditContext.tsx';
import GridContext from '../contexts/GridContext.tsx';
import GridStateContext from '../contexts/GridStateContext.tsx';
import SolverContext from '../contexts/SolverContext.tsx';
import PWAPrompt from '../components/PWAPrompt.tsx';
import EmbedContext from '../contexts/EmbedContext.tsx';
import InstructionPartsContext from '../contexts/InstructionPartsContext.tsx';

export const Route = createLazyFileRoute('/_context')({
  component: memo(function Context() {
    return (
      <EmbedContext name="root">
        <DisplayContext>
          <EditContext>
            <GridStateContext>
              <GridContext>
                <SolverContext>
                  <InstructionPartsContext>
                    <PWAPrompt />
                    <Outlet />
                  </InstructionPartsContext>
                </SolverContext>
              </GridContext>
            </GridStateContext>
          </EditContext>
        </DisplayContext>
      </EmbedContext>
    );
  }),
});
