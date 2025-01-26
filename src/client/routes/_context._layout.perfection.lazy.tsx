import InstructionList from '../instructions/InstructionList';
import MainGrid from '../grid/MainGrid';
import Metadata from '../metadata/Metadata';
import { createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import useLinkLoader from '../router/linkLoader';
import ThreePaneLayout from '../components/ThreePaneLayout';
import TouchControls from '../components/TouchControls';
import DocumentTitle from '../components/DocumentTitle';
import InstructionPartOutlet from '../instructions/InstructionPartOutlet';
import { PartPlacement } from '../instructions/parts/types';
import ForesightContext from '../contexts/ForesightContext';
import PerfectionRule from '@logic-pad/core/data/rules/perfectionRule';

export const Route = createLazyFileRoute('/_context/_layout/perfection')({
  component: memo(function PerfectionMode() {
    const params = Route.useSearch();
    useLinkLoader(params, {
      allowEmpty: false,
      modifyPuzzle: puzzle => {
        puzzle.grid = puzzle.grid.withRules(rules => [
          new PerfectionRule(),
          ...rules,
        ]);
        puzzle.solution =
          puzzle.solution?.withRules(rules => [
            new PerfectionRule(),
            ...rules,
          ]) ?? null;
        return puzzle;
      },
    });

    return (
      <ForesightContext>
        <ThreePaneLayout
          left={
            <>
              <DocumentTitle>Logic Pad</DocumentTitle>
              <div className="flex flex-col gap-2 justify-self-stretch flex-1 justify-center">
                <Metadata />
                <InstructionPartOutlet placement={PartPlacement.LeftPanel} />
              </div>
              <InstructionPartOutlet placement={PartPlacement.LeftBottom} />
              <TouchControls />
            </>
          }
          center={<MainGrid useToolboxClick={false} />}
          right={<InstructionList />}
        />
      </ForesightContext>
    );
  }),
});
