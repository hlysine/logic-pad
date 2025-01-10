import { forwardRef, memo, useEffect } from 'react';
import { cn, prefersReducedMotion } from '../uiHelper.ts';
import { State } from '@logic-pad/core/data/primitives';
import anime from 'animejs';
import { useGridState } from '../contexts/GridStateContext.tsx';

export interface GridRingProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  width: number;
  height: number;
}

function ringBorder(state: State) {
  switch (state) {
    case State.Satisfied:
      return cn('border-success shadow-glow-3xl shadow-success');
    case State.Error:
      return cn('border-error/30 shadow-glow-md shadow-error');
    default:
      return cn('border-primary/10');
  }
}

export default memo(
  forwardRef<HTMLDivElement, GridRingProps>(function StateRing(
    { children, width, height, ...rest }: GridRingProps,
    ref
  ) {
    const { state } = useGridState();

    useEffect(() => {
      if (state.final === State.Satisfied && !prefersReducedMotion()) {
        anime({
          targets: '.logic-animated .logic-tile',
          scale: [
            { value: 0.7, easing: 'easeOutSine', duration: 100 },
            { value: 1, easing: 'easeOutQuad', duration: 500 },
          ],
          delay: anime.stagger(20, { grid: [width, height], from: 'center' }),
        });
      }
    }, [state.final, width, height]);

    useEffect(() => {
      if (prefersReducedMotion()) {
        anime({
          targets: '.logic-animated .logic-tile',
          scale: 1,
          duration: 0,
          delay: 0,
        });
      } else {
        anime({
          targets: '.logic-animated .logic-tile',
          scale: [0, 1],
          delay: anime.stagger(10, {
            grid: [width, height],
            from: 'center',
            start: 100,
          }),
        });
      }
    }, [width, height]);

    return (
      <div
        ref={ref}
        className={cn(
          'w-fit h-fit border-4 p-4 rounded-xl transition-all delay-150 duration-150 ease-out logic-animated',
          ringBorder(state.final),
          state.final === State.Satisfied
            ? 'first:*:opacity-100 first:*:duration-[1.5s]'
            : 'first:*:opacity-0 first:*:duration-[0.5s]'
        )}
        {...rest}
      >
        <div className="block fixed inset-0 transition-all ease-out bg-radient-circle-c from-transparent to-success/10 z-[1000] pointer-events-none"></div>
        {children}
      </div>
    );
  })
);
