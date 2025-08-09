import { createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import useLinkLoader from '../router/linkLoader';
import PerfectionRule from '@logic-pad/core/data/rules/perfectionRule';
import PerfectionScreen from '../screens/PerfectionScreen';
import { instance as foresightInstance } from '@logic-pad/core/data/rules/foresightRule';

export const Route = createLazyFileRoute('/_context/_layout/perfection/')({
  component: memo(function PerfectionMode() {
    const params = Route.useSearch();
    useLinkLoader(params, {
      allowEmpty: false,
      modifyPuzzle: puzzle => {
        puzzle.grid = puzzle.grid.withRules(rules => [
          new PerfectionRule(),
          ...rules.filter(r => r.id !== foresightInstance.id),
        ]);
        puzzle.solution =
          puzzle.solution?.withRules(rules => [
            new PerfectionRule(),
            ...rules.filter(r => r.id !== foresightInstance.id),
          ]) ?? null;
        return puzzle;
      },
    });

    return <PerfectionScreen />;
  }),
});
