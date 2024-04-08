import { memo, useEffect } from 'react';
import { ringBorder } from './helper';
import { cn } from '../utils';
import { useGrid } from './GridContext';
import { State } from '../data/primitives';
import anime from 'animejs';

export interface GridRingProps {
  children?: React.ReactNode;
  width: number;
  height: number;
}

export default memo(function StateRing({
  children,
  width,
  height,
}: GridRingProps) {
  const { state } = useGrid();

  useEffect(() => {
    if (state.final === State.Satisfied) {
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
    anime({
      targets: '.logic-animated .logic-tile',
      scale: [0, 1],
      delay: anime.stagger(10, {
        grid: [width, height],
        from: 'center',
        start: 100,
      }),
    });
  }, [width, height]);

  return (
    <div
      className={cn(
        'w-fit h-fit border-4 p-4 rounded-xl transition-all delay-150 duration-150 ease-out logic-animated',
        ringBorder(state.final),
        state.final === State.Satisfied
          ? 'first:*:opacity-100 first:*:duration-[1.5s]'
          : 'first:*:opacity-0 first:*:duration-[0.5s]'
      )}
    >
      <div className="block fixed inset-0 transition-all ease-out bg-radient-circle-c from-transparent to-success/10 z-[1000] pointer-events-none"></div>
      {children}
    </div>
  );
});
