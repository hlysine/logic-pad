import { memo, useMemo } from 'react';
import { cn } from '../../../utils';
import QuestionMarkSignData from '../../../data/symbols/signs/questionMarkSign';

export interface QuestionMarkProps {
  size: number;
  textClass: string;
  symbol?: QuestionMarkSignData;
}

export default memo(function QuestionMarkSign({
  size,
  textClass,
}: QuestionMarkProps) {
  const textStyle = useMemo<React.CSSProperties>(
    () => ({
      fontSize: `${size * 0.75}px`,
    }),
    [size]
  );
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
      <span className={cn('absolute m-auto', textClass)} style={textStyle}>
        ?
      </span>
    </div>
  );
});
