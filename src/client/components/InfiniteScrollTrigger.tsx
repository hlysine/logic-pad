import { memo, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { cn } from '../uiHelper';

export interface InfiniteScrollTriggerProps {
  onLoadMore?: () => void;
  autoTrigger?: boolean;
  direction?: 'up' | 'down';
  className?: string;
}

export default memo(function InfiniteScrollTrigger({
  onLoadMore,
  autoTrigger = true,
  direction = 'down',
  className,
}: InfiniteScrollTriggerProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!onLoadMore) return;
    if (!autoTrigger) return;
    if (!buttonRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: buttonRef.current.closest('.infinite-scroll'),
        rootMargin: '0px',
        threshold: 1.0,
      }
    );
    if (buttonRef.current) {
      observer.observe(buttonRef.current);
    }
    return () => {
      if (buttonRef.current) {
        observer.unobserve(buttonRef.current);
        observer.disconnect();
      }
    };
  }, [onLoadMore]);
  if (!onLoadMore) return null;
  return (
    <button
      ref={buttonRef}
      className={cn('btn', className)}
      onClick={onLoadMore}
    >
      Load more
      {direction === 'down' ? <FaChevronDown /> : <FaChevronUp />}
    </button>
  );
});
