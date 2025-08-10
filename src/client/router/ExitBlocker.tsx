import { puzzleEquals } from '@logic-pad/core/index';
import { useBlocker } from '@tanstack/react-router';
import { memo } from 'react';
import { useGrid } from '../contexts/GridContext';
import { useSettings } from '../contexts/SettingsContext';
import { useOnlinePuzzle } from '../contexts/OnlinePuzzleContext';

export default memo(function ExitBlocker() {
  const [enableExitConfirmation] = useSettings('enableExitConfirmation');
  const { metadata, grid } = useGrid();
  const { lastSaved } = useOnlinePuzzle();
  useBlocker({
    shouldBlockFn: () =>
      enableExitConfirmation &&
      !window.confirm('Are you sure you want to leave?'),
    disabled:
      puzzleEquals(lastSaved, { ...metadata, grid, solution: null }) ||
      !enableExitConfirmation,
  });
  return null;
});
