import {
  createLazyFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { memo } from 'react';
import useLinkLoader from '../router/linkLoader';
import SolveScreen from '../screens/SolveScreen';

export const Route = createLazyFileRoute('/_context/_layout/solve')({
  component: memo(function SolveMode() {
    const params = Route.useSearch();
    const navigate = useNavigate();
    const search = useSearch({ from: '/_context/_layout/solve' });
    useLinkLoader(params, { allowEmpty: false });
    return (
      <SolveScreen>
        <button
          className="btn btn-outline btn-neutral"
          onClick={async () => {
            await navigate({
              to: '/perfection',
              search,
            });
          }}
        >
          Switch to Perfection Mode
        </button>
      </SolveScreen>
    );
  }),
});
