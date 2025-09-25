import { memo } from 'react';
import { cn } from '../uiHelper';
import { IoChevronForward } from 'react-icons/io5';
import { BsChevronCompactRight } from 'react-icons/bs';
import { Link, LinkProps } from '@tanstack/react-router';

export interface HorizontalScrollerProps extends Partial<LinkProps> {
  title: string;
  scrollable?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default memo(function HorizontalScroller({
  title,
  scrollable = true,
  children,
  className,
  ...props
}: HorizontalScrollerProps) {
  return (
    <>
      <div
        className="tooltip tooltip-info tooltip-right w-fit"
        data-tip="View more"
      >
        <Link
          className="btn btn-ghost text-2xl text-start font-normal justify-start w-fit"
          {...props}
        >
          {title}
          <IoChevronForward />
        </Link>
      </div>

      <div
        className={cn(
          'flex gap-4 py-4 h-fit items-stretch',
          scrollable
            ? 'overflow-y-hidden overflow-x-auto scrollbar-thin'
            : 'overflow-hidden',
          className
        )}
      >
        {children}
        {props.to &&
          scrollable &&
          !!children &&
          (!Array.isArray(children) || children.length > 0) && (
            <Link
              className="tooltip tooltip-info tooltip-left btn btn-ghost self-center px-0"
              data-tip="View more"
              {...props}
            >
              <BsChevronCompactRight size={36} />
            </Link>
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
