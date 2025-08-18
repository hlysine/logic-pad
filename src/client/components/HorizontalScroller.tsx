import { memo } from 'react';
import { BsChevronCompactRight } from 'react-icons/bs';

export interface HorizontalScrollerProps {
  children: React.ReactNode;
  onExpand?: () => void;
}

export default memo(function HorizontalScroller({
  children,
  onExpand,
}: HorizontalScrollerProps) {
  return (
    <div className="flex gap-4 h-fit overflow-x-auto overflow-y-visible items-center">
      {children}
      {onExpand && (
        <button
          className="tooltip tooltip-info tooltip-left btn btn-ghost h-full px-0"
          data-tip="View more"
          onClick={onExpand}
        >
          <BsChevronCompactRight size={36} />
        </button>
      )}
    </div>
  );
});
