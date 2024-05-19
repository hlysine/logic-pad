import {
  createLazyFileRoute,
  useBlocker,
  useNavigate,
} from '@tanstack/react-router';
import { memo } from 'react';
import useLinkLoader, { SolutionHandling } from '../ui/router/linkLoader';
import PuzzleEditor from '../ui/editor/PuzzleEditor';
import { IoWarningOutline } from 'react-icons/io5';
import ShareButton from '../ui/components/ShareButton';
import { defaultGrid, useGrid } from '../ui/GridContext';

export const Route = createLazyFileRoute('/_context/_layout/create')({
  component: memo(function CreateMode() {
    const params = Route.useSearch();
    const navigate = useNavigate();
    const linkResult = useLinkLoader(params, {
      cleanUrl: true,
      solutionHandling: SolutionHandling.Remove,
    });
    const { grid } = useGrid();
    useBlocker(
      () => window.confirm('Are you sure you want to leave?'),
      !params.d && !grid.equals(defaultGrid)
    );

    return (
      <PuzzleEditor>
        {linkResult && linkResult.solutionStripped && (
          <div
            className="tooltip tooltip-top tooltip-info flex shrink-0"
            data-tip="The puzzle solution has been removed to avoid spoiling the puzzle. Click to reload the puzzle with its original solution."
          >
            <div role="alert" className="alert shadow-lg gap-2">
              <IoWarningOutline className="text-warning" size={24} />
              <div>
                <h3 className="font-bold">Solution removed</h3>
                <div className="text-xs">Click to load original puzzle</div>
              </div>
              <button
                className="btn btn-sm btn-warning"
                onClick={() =>
                  navigate({
                    to: '/solve',
                    search: linkResult.originalParams,
                  })
                }
              >
                Load
              </button>
            </div>
          </div>
        )}
        <ShareButton />
      </PuzzleEditor>
    );
  }),
});
