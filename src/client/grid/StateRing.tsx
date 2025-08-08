import { forwardRef, memo, useEffect } from 'react';
import { cn } from '../uiHelper.ts';
import { State } from '@logic-pad/core/data/primitives';
import anime from 'animejs';
import { useGridState } from '../contexts/GridStateContext.tsx';
import { useRouterState } from '@tanstack/react-router';
import { useReducedMotion } from '../contexts/SettingsContext.tsx';
import { useEmbed } from '../contexts/EmbedContext.tsx';

export interface GridRingProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  width: number;
  height: number;
  animated?: boolean;
  className?: string;
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
    { children, width, height, animated, className, ...rest }: GridRingProps,
    ref
  ) {
    animated = animated ?? true;
    const { state } = useGridState();
    const router = useRouterState();
    const prefersReducedMotion = useReducedMotion();
    const { isTopLevel } = useEmbed();

    useEffect(() => {
      if (State.isSatisfied(state.final) && !prefersReducedMotion) {
        anime({
          targets: '.logic-animated .logic-tile',
          scale: [
            { value: 0.7, easing: 'easeOutSine', duration: 100 },
            { value: 1, easing: 'easeOutQuad', duration: 500 },
          ],
          delay: anime.stagger(20, { grid: [width, height], from: 'center' }),
        });
      }
    }, [state.final, width, height, prefersReducedMotion]);

    useEffect(() => {
      if (
        prefersReducedMotion ||
        router.location.pathname === '/create' ||
        !animated
      ) {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, height, router.location.pathname, prefersReducedMotion]);

    return (
      <div
        ref={ref}
        className={cn(
          'w-fit h-fit border-4 p-4 rounded-xl transition-all delay-150 duration-150 ease-out logic-animated',
          ringBorder(state.final),
          State.isSatisfied(state.final)
            ? 'first:*:opacity-100 first:*:duration-[1.5s]'
            : 'first:*:opacity-0 first:*:duration-[0.5s]',
          className
        )}
        {...rest}
      >
        <div
          className={
            animated && isTopLevel
              ? 'block fixed inset-0 transition-all ease-out bg-radient-circle-c from-transparent to-success/10 z-[1000] pointer-events-none'
              : 'hidden'
          }
        ></div>
        {children}
      </div>
    );
  })
);
