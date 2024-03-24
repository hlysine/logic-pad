import { memo } from 'react';
import { cn } from '../../../utils';
import QuestionMarkSignData from '../../../data/symbols/signs/questionMarkSign';

export interface QuestionMarkProps {
  textClass: string;
  symbol?: QuestionMarkSignData;
}

export default memo(function QuestionMarkSign({
  textClass,
}: QuestionMarkProps) {
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
      <span className={cn('absolute m-auto text-[0.75em]', textClass)}>?</span>
    </div>
  );
});
