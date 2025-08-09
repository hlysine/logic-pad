import {
  createLazyFileRoute,
  useBlocker,
  useNavigate,
} from '@tanstack/react-router';
import { memo } from 'react';
import useLinkLoader, { SolutionHandling } from '../router/linkLoader';
import PuzzleEditorScreen from '../screens/PuzzleEditorScreen';
import { IoWarningOutline } from 'react-icons/io5';
import { defaultGrid, useGrid } from '../contexts/GridContext';
import { useSettings } from '../contexts/SettingsContext';

export const Route = createLazyFileRoute('/_context/_layout/create')({
  component: memo(function CreateMode() {
    const params = Route.useSearch();
    const navigate = useNavigate();
    const linkResult = useLinkLoader(params, {
      cleanUrl: true,
      solutionHandling: SolutionHandling.Remove,
    });
    const { grid } = useGrid();
    const [enableExitConfirmation] = useSettings('enableExitConfirmation');
    useBlocker({
      shouldBlockFn: () =>
        enableExitConfirmation &&
        !window.confirm('Are you sure you want to leave?'),
      disabled:
        !!params.d || grid.equals(defaultGrid) || !enableExitConfirmation,
    });

    return (
      <PuzzleEditorScreen>
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
                type="button"
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
      </PuzzleEditorScreen>
    );
  }),
});
