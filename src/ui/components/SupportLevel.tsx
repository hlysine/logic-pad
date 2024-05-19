import { memo } from 'react';
import { BiSolidFlagCheckered } from 'react-icons/bi';
import { cn } from '../../utils';
import { RiRobot2Fill } from 'react-icons/ri';

export interface SupportLevelProps {
  validate?: boolean;
  solve?: boolean;
}

export default memo(function SupportLevel({
  validate,
  solve,
}: SupportLevelProps) {
  return (
    <div className="flex items-center rounded-box border-2 border-base-100 px-4 gap-2">
      <span className="text-xs opacity-70">Support:</span>
      {validate !== undefined && (
        <div
          className="tooltip tooltip-top tooltip-info"
          data-tip={
            validate
              ? 'Validates solution automatically'
              : 'Only checks against provided solution'
          }
        >
          <BiSolidFlagCheckered
            size={22}
            className={cn(validate ? 'text-success' : 'text-error')}
          />
        </div>
      )}
      {solve !== undefined && (
        <div
          className="tooltip tooltip-top tooltip-info"
          data-tip={solve ? 'Supported by solver' : 'Not supported by solver'}
        >
          <RiRobot2Fill
            size={22}
            className={cn(solve ? 'text-success' : 'text-error')}
          />
        </div>
      )}
    </div>
  );
});
