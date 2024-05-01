import { memo } from 'react';
import { BiSolidFlagCheckered } from 'react-icons/bi';
import { cn } from '../../utils';

export interface SupportLevelProps {
  validate: boolean;
}

export default memo(function SupportLevel({ validate }: SupportLevelProps) {
  return (
    <div className="flex items-center rounded-box border-2 border-base-100 px-4 gap-2">
      <span className="text-xs opacity-70">Support:</span>
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
    </div>
  );
});
