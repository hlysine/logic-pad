import {
  createLazyFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { memo } from 'react';
import useLinkLoader from '../router/linkLoader';
import SolveScreen from '../screens/SolveScreen';
import { GridConsumer } from '../contexts/GridContext';
import { instance as musicGridInstance } from '@logic-pad/core/data/rules/musicGridRule';
import SharePuzzleImage from '../components/SharePuzzleImage';

export const Route = createLazyFileRoute('/_context/_layout/solve/')({
  component: memo(function SolveMode() {
    const params = Route.useSearch();
    const navigate = useNavigate();
    const search = useSearch({ from: '/_context/_layout/solve/' });
    useLinkLoader(params, { allowEmpty: false });
    return (
      <SolveScreen>
        <GridConsumer>
          {({ grid }) =>
            grid.findRule(r => r.id === musicGridInstance.id) ? null : (
              <button
                className="btn btn-outline btn-neutral btn-sm lg:btn-md w-full max-w-[320px] self-center"
                onClick={async () => {
                  await navigate({
                    to: '/perfection',
                    search,
                  });
                }}
              >
                Switch to Perfection Mode
              </button>
            )
          }
        </GridConsumer>
        <SharePuzzleImage />
      </SolveScreen>
    );
  }),
});
