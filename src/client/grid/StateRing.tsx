import { forwardRef, memo, useEffect, useId } from 'react';
import { cn } from '../uiHelper.ts';
import { State } from '@logic-pad/core/data/primitives';
import { animate, stagger } from 'animejs';
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
    const id = useId();
    const { state } = useGridState();
    const router = useRouterState();
    const prefersReducedMotion = useReducedMotion();
    const { isTopLevel } = useEmbed();

    useEffect(() => {
      if (State.isSatisfied(state.final) && !prefersReducedMotion && animated) {
        animate(`#${id}.logic-animated .logic-tile`, {
          scale: [
            { to: 0.7, ease: 'outSine', duration: 100 },
            { to: 1, ease: 'outQuad', duration: 500 },
          ],
          delay: stagger(20, { grid: [width, height], from: 'center' }),
        });
      }
    }, [state.final, width, height, prefersReducedMotion, animated, id]);

    useEffect(() => {
      if (prefersReducedMotion || !animated) {
        animate(`#${id}.logic-animated .logic-tile`, {
          scale: 1,
          duration: 0,
          delay: 0,
        });
      } else {
        animate(`#${id}.logic-animated .logic-tile`, {
          scale: [0, 1],
          delay: stagger(20, {
            grid: [width, height],
            from: 'center',
            start: 100,
          }),
          duration: 300,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, height, router.location.pathname, prefersReducedMotion]);

    return (
      <div
        ref={ref}
        id={id}
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
