import { memo } from 'react';
import { PartPlacement, PartSpec } from './types';
import PerfectionRule, {
  instance as perfectionInstance,
} from '@logic-pad/core/data/rules/perfectionRule';

export interface PerfectionControlsPartProps {
  instruction: PerfectionRule;
}

export default memo(function PerfectionControlsPart() {
  return (
    <div className="grow-0 shrink-0 bg-primary/10 flex flex-col items-stretch">
      <div className="flex gap-2 justify-around items-center">
        {/* todo: toggle to visualize solve path */}
        {/* todo: button to copy solve path */}
        <span>TODO: Toggle to visualize solve path</span>
        <span>TODO: Button to copy solve path</span>
      </div>
      <progress
        className="progress progress-primary"
        value={70}
        max="100"
      ></progress>
    </div>
  );
});

export const spec: PartSpec = {
  placement: PartPlacement.LeftBottom,
  instructionId: perfectionInstance.id,
};
