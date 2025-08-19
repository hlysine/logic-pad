import { memo } from 'react';
import { cn } from '../uiHelper';
import { IoChevronForward } from 'react-icons/io5';
import { BsChevronCompactRight } from 'react-icons/bs';

export interface HorizontalScrollerProps {
  title: string;
  scrollable?: boolean;
  children: React.ReactNode;
  className?: string;
  onExpand?: () => void;
}

export default memo(function HorizontalScroller({
  title,
  scrollable = true,
  children,
  className,
  onExpand,
}: HorizontalScrollerProps) {
  return (
    <>
      <div
        className="tooltip tooltip-info tooltip-right w-fit"
        data-tip="View more"
      >
        <button
          className="btn btn-ghost text-2xl text-start font-normal justify-start w-fit"
          onClick={onExpand}
        >
          {title}
          <IoChevronForward />
        </button>
      </div>

      <div
        className={cn(
          'flex gap-4 py-4 h-fit  items-stretch',
          scrollable
            ? 'overflow-y-hidden overflow-x-auto scrollbar-thin'
            : 'overflow-hidden',
          className
        )}
      >
        {children}
        {onExpand &&
          scrollable &&
          !!children &&
          (!Array.isArray(children) || children.length > 0) && (
            <button
              className="tooltip tooltip-info tooltip-left btn btn-ghost h-full px-0"
              data-tip="View more"
              onClick={onExpand}
            >
              <BsChevronCompactRight size={36} />
            </button>
          )}
        {!children || (Array.isArray(children) && children.length === 0) ? (
          <div className="flex items-center justify-center py-4">
            <p className="text-sm opacity-80">Nothing here yet</p>
          </div>
        ) : null}
      </div>
    </>
  );
});
