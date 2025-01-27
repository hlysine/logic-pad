import { createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import useLinkLoader from '../router/linkLoader';
import SolveScreen from '../screens/SolveScreen';

export const Route = createLazyFileRoute('/_context/_layout/solve')({
  component: memo(function SolveMode() {
    const params = Route.useSearch();
    useLinkLoader(params, { allowEmpty: false });
    return (
      <SolveScreen>
        <button
          className="btn btn-outline btn-neutral"
          onClick={() => {
            window.location.pathname = '/perfection';
          }}
        >
          Switch to Perfection Mode
        </button>
      </SolveScreen>
    );
  }),
});
