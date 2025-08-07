import { createLazyFileRoute, useBlocker } from '@tanstack/react-router';
import { memo } from 'react';
import PuzzleEditorScreen from '../screens/PuzzleEditorScreen';
import { useGrid } from '../contexts/GridContext';
import { useSettings } from '../contexts/SettingsContext';
import { useSuspenseQuery } from '@tanstack/react-query';
import { puzzleQueryOptions } from './_context._layout.edit.$puzzleId';
import useOnlineLinkLoader from '../router/onlineLinkLoader';
import { SolutionHandling } from '../router/linkLoader';
import { useOnlinePuzzle } from '../contexts/OnlinePuzzleContext';

export const Route = createLazyFileRoute('/_context/_layout/edit/$puzzleId')({
  component: memo(function OnlineCreateMode() {
    const { data } = useSuspenseQuery(
      puzzleQueryOptions(Route.useParams().puzzleId)
    );
    const { lastSaved } = useOnlinePuzzle();
    useOnlineLinkLoader(data, {
      solutionHandling: SolutionHandling.LoadVisible,
    });

    const [enableExitConfirmation] = useSettings('enableExitConfirmation');
    const { grid } = useGrid();
    useBlocker({
      shouldBlockFn: () =>
        enableExitConfirmation &&
        !window.confirm('Are you sure you want to leave?'),
      disabled: grid.equals(lastSaved) || !enableExitConfirmation,
    });

    return <PuzzleEditorScreen></PuzzleEditorScreen>;
  }),
});
