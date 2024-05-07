import { memo } from 'react';
import { cn } from '../../utils';
import ViewpointSymbolData from '../../data/symbols/viewpointSymbol';
import {
  FiChevronUp,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

export interface ViewpointProps {
  textClass: string;
  symbol: ViewpointSymbolData;
}

export default memo(function ViewpointSymbol({
  textClass,
  symbol,
}: ViewpointProps) {
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
      <span className={cn('absolute m-auto text-[0.6em]', textClass)}>
        {symbol.number}
      </span>
      <div className="absolute mx-auto top-0 mb-auto -m-[0.05em]">
        <FiChevronUp size={'0.4em'} />
      </div>
      <div className="absolute mx-auto bottom-0 mt-auto -m-[0.05em]">
        <FiChevronDown size={'0.4em'} />
      </div>
      <div className="absolute my-auto left-0 mr-auto -m-[0.05em]">
        <FiChevronLeft size={'0.4em'} />
      </div>
      <div className="absolute my-auto right-0 ml-auto -m-[0.05em]">
        <FiChevronRight size={'0.4em'} />
      </div>
    </div>
  );
});

export const id = 'viewpoint';
